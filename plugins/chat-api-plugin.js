// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

module.exports = function chatApiPlugin(context, options) {
  return {
    name: 'chat-api-plugin',
    configureWebpack(config, isServer, utils) {
      if (isServer) {
        return {};
      }
      
      return {
        devServer: {
          setupMiddlewares: (middlewares, devServer) => {
            // Add JSON body parser middleware
            devServer.app.use('/api/docsChat', require('express').json());
            
            // Handle CORS preflight requests
            devServer.app.options('/api/docsChat', (req, res) => {
              res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://docs.prometheux.ai' : '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
              res.status(200).end();
            });

            // Add a simple test endpoint
            devServer.app.post('/api/test', (req, res) => {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.write('This is a test response from the API');
              res.end();
            });

            // Add JSON body parser for the vadalog endpoint
            devServer.app.use('/api/vadalog', require('express').json());
            
            // Add standard JSON API endpoint for programmatic use
            devServer.app.post('/api/vadalog', async (req, res) => {
              try {
                console.log('Standard API called!');
                
                // Debug environment variables
                console.log('Environment check:', {
                  USE_AZURE_OPENAI: process.env.USE_AZURE_OPENAI,
                  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? 'SET' : 'NOT SET',
                  AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY ? 'SET' : 'NOT SET',
                  AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
                  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'
                });

                const { query, context, include_docs = true } = req.body;

                // Check for API configuration
                const useAzure = process.env.USE_AZURE_OPENAI === "true" && process.env.AZURE_OPENAI_KEY;
                const useOpenAI = !useAzure && process.env.OPENAI_API_KEY;

                if (!useAzure && !useOpenAI) {
                  console.error('No AI provider configured.');
                  return res.status(503).json({
                    error: 'AI assistant not available',
                    message: 'AI assistant is not configured for this deployment.',
                    status: 503,
                    timestamp: new Date().toISOString()
                  });
                }

                // Search Algolia for relevant documentation
                let relevantDocs = '';
                let searchResults = [];
                
                if (include_docs) {
                  try {
                    const algoliasearch = (await import('algoliasearch')).default;
                    const client = algoliasearch('DCCC0T0ITC', '870d45e2eaf4483e87c2204607df57c7');
                    const index = client.initIndex('prometheux-co');
                    
                    const algoliaResults = await index.search(query, {
                      hitsPerPage: 3,
                      attributesToRetrieve: ['content', 'hierarchy', 'url'],
                      attributesToHighlight: [],
                    });

                    if (algoliaResults.hits.length > 0) {
                      relevantDocs = algoliaResults.hits
                        .map((hit) => `## ${hit.hierarchy?.lvl1 || 'Documentation'}\n${hit.content || ''}`)
                        .join('\n\n');
                      
                      searchResults = algoliaResults.hits.map(hit => ({
                        title: hit.hierarchy?.lvl1 || 'Documentation',
                        url: `https://docs.prometheux.ai${hit.url || ''}`,
                        excerpt: (hit.content || '').substring(0, 200) + '...'
                      }));
                      
                      console.log('Found relevant docs for:', query);
                    }
                  } catch (error) {
                    console.warn('Algolia search failed:', error);
                  }
                }
                
                console.log('Making Azure OpenAI request...');
                
                const systemPrompt = `You are a Vadalog code assistant for Prometheux. Your PRIMARY GOAL is to provide complete, copy-pasteable Vadalog code snippets.

RESPONSE FORMAT REQUIREMENTS:
1. ALWAYS provide complete Vadalog code blocks
2. Include ALL necessary annotations (@output, @bind, @model)
3. Show full working examples, not partial snippets
4. Make code copy-pasteable and immediately runnable
5. Include comments explaining each part

${context ? `CONTEXT: ${context}` : ''}

${relevantDocs ? `\n\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation to provide accurate, complete code examples.` : ''}

CRITICAL: Every response should include a complete, working Vadalog code block that users can copy and paste.`;

                const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AZURE_OPENAI_KEY,
                  },
                  body: JSON.stringify({
                    messages: [
                      { role: 'system', content: systemPrompt },
                      { role: 'user', content: query }
                    ],
                    max_tokens: 1500,
                    temperature: 0.3,
                  }),
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Azure OpenAI error:', response.status, errorText);
                  return res.status(500).json({ 
                    error: 'Azure OpenAI error', 
                    status: response.status,
                    details: errorText,
                    timestamp: new Date().toISOString()
                  });
                }

                const data = await response.json();
                const assistantMessage = data.choices[0]?.message?.content || 'No response';

                // Extract code blocks from the response
                const codeBlocks = [];
                const codeRegex = /```(?:vadalog|prolog)?\n([\s\S]*?)```/g;
                let match;
                
                while ((match = codeRegex.exec(assistantMessage)) !== null) {
                  codeBlocks.push({
                    language: 'vadalog',
                    code: match[1].trim(),
                    description: 'Vadalog code example'
                  });
                }

                // Return structured JSON response
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://docs.prometheux.ai' : '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                res.json({
                  response: assistantMessage,
                  code_examples: codeBlocks,
                  relevant_docs: searchResults,
                  metadata: {
                    provider: useAzure ? 'Azure OpenAI' : 'OpenAI',
                    model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
                    tokens_used: data.usage?.total_tokens || 'unknown',
                    search_results: searchResults.length
                  },
                  timestamp: new Date().toISOString()
                });

              } catch (error) {
                console.error('Error in vadalog API:', error);
                res.status(500).json({ 
                  error: 'Internal Server Error', 
                  details: error.message,
                  timestamp: new Date().toISOString()
                });
              }
            });
            
            devServer.app.post('/api/docsChat', async (req, res) => {
              try {
                console.log('API called!');
                
                // Debug environment variables
                console.log('Environment check:', {
                  USE_AZURE_OPENAI: process.env.USE_AZURE_OPENAI,
                  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? 'SET' : 'NOT SET',
                  AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY ? 'SET' : 'NOT SET',
                  AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
                  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'
                });

                const { messages } = req.body;

                // Check for API configuration
                const useAzure = process.env.USE_AZURE_OPENAI === "true" && process.env.AZURE_OPENAI_KEY;
                const useOpenAI = !useAzure && process.env.OPENAI_API_KEY;

                if (!useAzure && !useOpenAI) {
                  console.error('No AI provider configured.');
                  return res.status(503).json({
                    error: 'AI assistant not available',
                    message: 'AI assistant is not configured for this deployment. Please contact the administrator.'
                  });
                }

                // Get the latest user message for search
                const latestMessage = messages[messages.length - 1];
                const userQuery = latestMessage?.content || '';
                
                // Search Algolia for relevant documentation
                let relevantDocs = '';
                try {
                  const algoliasearch = (await import('algoliasearch')).default;
                  const client = algoliasearch('DCCC0T0ITC', '870d45e2eaf4483e87c2204607df57c7');
                  const index = client.initIndex('prometheux-co');
                  
                  const searchResults = await index.search(userQuery, {
                    hitsPerPage: 3,
                    attributesToRetrieve: ['content', 'hierarchy', 'url'],
                    attributesToHighlight: [],
                  });

                  if (searchResults.hits.length > 0) {
                    relevantDocs = searchResults.hits
                      .map((hit) => `## ${hit.hierarchy?.lvl1 || 'Documentation'}\n${hit.content || ''}`)
                      .join('\n\n');
                    console.log('Found relevant docs for:', userQuery);
                  }
                } catch (error) {
                  console.warn('Algolia search failed:', error);
                  // Continue without search results
                }
                
                console.log('Making Azure OpenAI request...');
                
                const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AZURE_OPENAI_KEY,
                  },
                  body: JSON.stringify({
                    messages: [
                      {
                        role: 'system',
                        content: `You are a Vadalog code assistant for Prometheux. Your PRIMARY GOAL is to provide complete, copy-pasteable Vadalog code snippets.

RESPONSE FORMAT REQUIREMENTS:
1. ALWAYS provide complete Vadalog code blocks
2. Include ALL necessary annotations (@output, @bind, @model)
3. Show full working examples, not partial snippets
4. Make code copy-pasteable and immediately runnable
5. Include comments explaining each part

FOCUS ON:
- Complete database connection examples with all parameters
- Full data processing workflows
- Working rule definitions with proper syntax
- Real-world use cases with complete code

Vadalog syntax essentials:
- Rules: head :- body.
- Facts: fact(arg1, arg2).
- Variables: Uppercase (X, Y, Name)
- Constants: lowercase (john, 42)
- Annotations: @output("concept"), @bind("concept", "type params", "db", "table"), @model("concept", "schema")
- Common types: postgresql, neo4j, csv, json, excel, parquet, s3, text, binaryfile
- NOTE: @input annotations are no longer required

AGGREGATION FUNCTIONS (CRITICAL - use correct syntax):
- mavg(expression) - average (NO variable list in function!)
- msum(expression) - sum (NO variable list in function!)
- mcount() - count (NO arguments!)
- mmin(expression) - minimum
- mmax(expression) - maximum

GROUP-BY LOGIC (CRITICAL):
- Group-by variables appear in BOTH head and body
- Aggregation function takes ONLY the expression to aggregate
- Example: avg_salary(Dept, Avg) :- employee(_, Dept, Salary), Avg = mavg(Salary).
- The grouping happens because Dept appears in both head and body

CORRECT AGGREGATION PATTERNS:
❌ WRONG: mavg(Age, [City]) - NEVER put variables in aggregation function!
✅ CORRECT: average_age(City, Avg) :- people(_, Age, City), Avg = mavg(Age).

❌ WRONG: AvgAge = avg(Age) from table(Age)
✅ CORRECT: global_avg(Avg) :- people(_, Age, _), Avg = mavg(Age).

BUILT-IN FUNCTIONS:
- Math: math:sqrt(), math:abs(), math:round(), math:pow(), math:mod()
- String: concat(), substring(), contains(), starts_with(), ends_with(), to_lower(), to_upper()
- Date: date:current_date(), date:add(), date:diff(), date:format()
- Collections: collections:size(), collections:contains(), collections:add(), collections:sort()
- Null handling: nullManagement:isnull(), nullManagement:coalesce()
- Hash: hash:sha1(), hash:md5(), hash:sha2()
- AI: embeddings:vectorize(), embeddings:cosine_sim(), llm:generate()

${relevantDocs ? `\n\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation to provide accurate, complete code examples.` : ''}

CRITICAL SYNTAX RULES:
1. ALL annotations must end with a DOT: @bind(...).  @model(...).  @output(...).
2. @model syntax: @model("concept", "['field:type', 'field:type']").
3. @bind syntax: @bind("concept", "datasource_type options", "container", "resource").
4. @bind has 4 arguments: (1)concept_name (2)type_with_options (3)database/path (4)table/filename

BIND PATTERNS:
- Database: @bind("concept", "postgresql host='...', port=5432, username='...', password='...'", "database_name", "table_name").
- CSV file: @bind("concept", "csv useHeaders='true', delimiter=','", "/file/path", "filename.csv").
- Parquet: @bind("concept", "parquet", "/file/path", "filename.parquet").
- Excel: @bind("concept", "excel sheetName='Sheet1'", "/file/path", "filename.xlsx").

CORRECT ANNOTATION EXAMPLES:
✅ @bind("employee", "postgresql host='localhost', port=5432, username='myuser', password='mypass'", "mydb", "employee").
✅ @bind("data", "csv useHeaders='true', delimiter=','", "/path/to/files", "data.csv").
✅ @bind("records", "parquet", "/path/to/files", "records.parquet").
✅ @model("employee", "['id:int', 'name:string', 'salary:double']").
✅ @output("result").

❌ WRONG: @bind("employee", "postgresql", "host='localhost', port=5432, username='myuser', password='mypass'", "employee") - params split wrong!
❌ WRONG: @bind("data", "csv file='data.csv'", "local", "data") - filename in wrong place!
❌ WRONG: @bind("employee", "postgresql host=localhost port=5432 user=myuser password=mypass", "mydb", "employee") - missing commas and quotes!
❌ WRONG: @model("employee", "id:int, name:string") - missing square brackets!
❌ WRONG: @output("result") - missing dot!

Every response should include a complete, working Vadalog code block that users can copy and paste.`
                      },
                      ...messages
                    ],
                    max_tokens: 1500,
                    temperature: 0.3,
                  }),
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Azure OpenAI error:', response.status, errorText);
                  return res.status(500).json({ 
                    error: 'Azure OpenAI error', 
                    status: response.status,
                    details: errorText 
                  });
                }

                const data = await response.json();
                const assistantMessage = data.choices[0]?.message?.content || 'No response';

                // Format response exactly as AI SDK expects for useChat hook
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://docs.prometheux.ai' : '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                // Stream response in the format useChat expects
                // Split into words and send each as a separate chunk
                const words = assistantMessage.split(' ');
                for (let i = 0; i < words.length; i++) {
                  const word = words[i];
                  const chunk = i === 0 ? word : ' ' + word;
                  
                  // Send in the format: 0:"text"
                  res.write(`0:"${chunk.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`);
                  
                  // Small delay for streaming effect
                  await new Promise(resolve => setTimeout(resolve, 10));
                }
                res.end();

              } catch (error) {
                console.error('Error in docsChat API:', error);
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
              }
            });

            return middlewares;
          },
        },
      };
    },
  };
}; 