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
                    
                    // Extract key technical terms from natural language queries
                    const extractKeyTerms = (query) => {
                      // Remove punctuation and convert to lowercase
                      const cleaned = query.toLowerCase().replace(/[?.,!;:]/g, '');
                      
                      // Expanded stop words including common verbs
                      const stopWords = ['how', 'do', 'does', 'did', 'i', 'can', 'could', 'would', 'should', 
                                        'you', 'please', 'show', 'me', 'the', 'a', 'an', 'in', 'to', 'for', 
                                        'with', 'using', 'use', 'using', 'compute', 'calculate', 'create', 
                                        'make', 'get', 'find', 'my', 'vadalog', 'prometheux'];
                      
                      const words = cleaned.split(/\s+/);
                      const keyTerms = words.filter(w => !stopWords.includes(w) && w.length > 2);
                      
                      // If we filtered out too much, return original (without punctuation)
                      return keyTerms.length > 0 ? keyTerms.join(' ') : cleaned;
                    };
                    
                    const searchQuery = extractKeyTerms(query) || query;
                    console.log(`[Algolia] Original query: "${query}"`);
                    console.log(`[Algolia] Search query: "${searchQuery}"`);
                    
                    const algoliaResults = await index.search(searchQuery, {
                      hitsPerPage: 5,  // Get more results for better coverage
                      attributesToRetrieve: ['content', 'hierarchy', 'url'],
                      attributesToHighlight: [],
                      removeStopWords: true,  // Let Algolia also remove stop words
                    });

                    if (algoliaResults.hits.length > 0) {
                      // Take top 3 most relevant results
                      const topHits = algoliaResults.hits.slice(0, 3);
                      
                      relevantDocs = topHits
                        .map((hit) => `## ${hit.hierarchy?.lvl1 || 'Documentation'}\n${hit.content || ''}`)
                        .join('\n\n');
                      
                      searchResults = topHits.map(hit => ({
                        title: hit.hierarchy?.lvl1 || 'Documentation',
                        url: hit.url?.startsWith('http') ? hit.url : `https://docs.prometheux.ai${hit.url || ''}`,
                        excerpt: (hit.content || '').substring(0, 200) + '...'
                      }));
                      
                      console.log(`[Algolia] Found ${algoliaResults.nbHits} total docs, using top ${topHits.length}`);
                      console.log('[Algolia] Retrieved sections:', searchResults.map(r => r.title).join(', '));
                      console.log(`[Algolia] Total chars injected into prompt: ${relevantDocs.length}`);
                    } else {
                      console.warn(`[Algolia] No results found for search query: "${searchQuery}"`);
                    }
                  } catch (error) {
                    console.warn('Algolia search failed:', error);
                  }
                }
                
                console.log('Making Azure OpenAI request...');
                
                const systemPrompt = `You are a Vadalog code assistant for Prometheux.

RESPONSE GUIDELINES:
1. Provide focused, copy-pasteable Vadalog code examples
2. Include annotations (@output, @bind, @model) only when relevant to the question
3. Match complexity to the question - simple questions get simple examples
4. Use % (percent sign) for comments, NOT # (hash)
5. Follow Vadalog syntax: Rules use ":-" or "<-", facts end with ".", variables are Uppercase

CRITICAL SYNTAX RULES:
- Graph functions: Variables go ONLY in rule head, NOT after function
  ✅ CORRECT: path(X,Y) :- #TC(edge).
  ❌ WRONG: path(X,Y) :- #TC(edge)(X,Y).
- Follow documentation syntax EXACTLY - do not add extra parentheses or parameters
- Both :- and <- work the same way (interchangeable)

${context ? `USER CONTEXT: ${context}\n` : ''}
${relevantDocs ? `\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation as your primary reference for syntax, examples, and best practices.` : ''}

Provide accurate, helpful code examples based on the retrieved documentation above.`;

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
                  
                  // Extract key technical terms from natural language queries
                  const extractKeyTerms = (query) => {
                    // Remove punctuation and convert to lowercase
                    const cleaned = query.toLowerCase().replace(/[?.,!;:]/g, '');
                    
                    // Expanded stop words including common verbs
                    const stopWords = ['how', 'do', 'does', 'did', 'i', 'can', 'could', 'would', 'should', 
                                      'you', 'please', 'show', 'me', 'the', 'a', 'an', 'in', 'to', 'for', 
                                      'with', 'using', 'use', 'using', 'compute', 'calculate', 'create', 
                                      'make', 'get', 'find', 'my', 'vadalog', 'prometheux'];
                    
                    const words = cleaned.split(/\s+/);
                    const keyTerms = words.filter(w => !stopWords.includes(w) && w.length > 2);
                    
                    // If we filtered out too much, return original (without punctuation)
                    return keyTerms.length > 0 ? keyTerms.join(' ') : cleaned;
                  };
                  
                  const searchQuery = extractKeyTerms(userQuery) || userQuery;
                  console.log(`[Algolia] Original query: "${userQuery}"`);
                  console.log(`[Algolia] Search query: "${searchQuery}"`);
                  
                  const searchResults = await index.search(searchQuery, {
                    hitsPerPage: 5,  // Get more results for better coverage
                    attributesToRetrieve: ['content', 'hierarchy', 'url'],
                    attributesToHighlight: [],
                    removeStopWords: true,  // Let Algolia also remove stop words
                  });

                  if (searchResults.hits.length > 0) {
                    // Take top 3 most relevant results
                    const topHits = searchResults.hits.slice(0, 3);
                    
                    relevantDocs = topHits
                      .map((hit) => `## ${hit.hierarchy?.lvl1 || 'Documentation'}\n${hit.content || ''}`)
                      .join('\n\n');
                    
                    const sections = topHits.map(hit => hit.hierarchy?.lvl1 || 'Unknown');
                    console.log(`[Algolia] Found ${searchResults.nbHits} total docs, using top ${topHits.length}`);
                    console.log('[Algolia] Retrieved sections:', sections.join(', '));
                    console.log(`[Algolia] Total chars injected into prompt: ${relevantDocs.length}`);
                  } else {
                    console.warn(`[Algolia] No results found for search query: "${searchQuery}"`);
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
                        content: `You are a Vadalog code assistant for Prometheux.

RESPONSE GUIDELINES:
1. Provide focused, copy-pasteable Vadalog code examples
2. Include annotations (@output, @bind, @model) only when relevant to the question
3. Match complexity to the question - simple questions get simple examples
4. Use % (percent sign) for comments, NOT # (hash)
5. Follow Vadalog syntax: Rules use ":-" or "<-", facts end with ".", variables are Uppercase

CRITICAL SYNTAX RULES:
- Graph functions: Variables go ONLY in rule head, NOT after function
  ✅ CORRECT: path(X,Y) :- #TC(edge).
  ❌ WRONG: path(X,Y) :- #TC(edge)(X,Y).
- Follow documentation syntax EXACTLY - do not add extra parentheses or parameters
- Both :- and <- work the same way (interchangeable)

KEY SYNTAX REMINDERS:
- Annotations must end with a dot: @bind(...).  @model(...).  @output(...).
- Aggregations: mavg(expr), msum(expr), mcount() - NO variable lists
- Group-by: variables appear in both head and body
- Logical operators exist: and(), or(), not(), if(cond, true_val, false_val)

${relevantDocs ? `\n\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation as your primary reference for syntax, examples, and best practices.` : ''}

Provide accurate, helpful code examples based on the retrieved documentation above.`
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