// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });
const VADALOG_SYSTEM_PROMPT = require('./vadalog-reference');

function getProviderLabel(provider) {
  const labels = { anthropic: 'Anthropic', azure: 'Azure OpenAI' };
  return labels[provider] || provider;
}

function getModelName(provider) {
  if (provider === 'anthropic') return process.env.ANTHROPIC_MODEL || 'claude-opus-4-6';
  return process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
}

async function callAnthropic(systemPrompt, messages, { maxTokens = 4096, temperature = 0.3 } = {}) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-6';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.content
    ?.filter(block => block.type === 'text')
    .map(block => block.text)
    .join('') || 'No response';
  const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
  return { text, tokensUsed, provider: 'anthropic' };
}

async function callAzure(systemPrompt, messages, { maxTokens = 4096, temperature = 0.3 } = {}) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const response = await fetch(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_KEY,
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: maxTokens,
        temperature,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || 'No response';
  const tokensUsed = data.usage?.total_tokens || 'unknown';
  return { text, tokensUsed, provider: 'azure' };
}

async function refineQuery(rawText) {
  if (!process.env.AZURE_OPENAI_KEY) return rawText;

  const refinePrompt =
    'You are a query refinement assistant. ' +
    'The user is asking a question about Vadalog (a logic-programming / knowledge-graph language) or its documentation. ' +
    'Your ONLY job is to rewrite their message so it is grammatically correct, clear, and well-structured. ' +
    'Rules:\n' +
    '- Fix spelling, grammar, and punctuation.\n' +
    '- Preserve every technical term, file path, predicate name, and annotation exactly as-is.\n' +
    '- Do NOT answer the question — just return the improved version.\n' +
    '- Do NOT add extra commentary, prefixes like "Here is the refined query:", or quotes.\n' +
    '- If the message is already clear, return it unchanged.\n' +
    '- Keep the same language (e.g. if the user writes in Italian, refine in Italian).';

  try {
    const result = await callAzure(refinePrompt, [{ role: 'user', content: rawText }], {
      maxTokens: 512,
      temperature: 0.1,
    });
    const refined = result.text.trim();
    if (refined && refined.length > 0) {
      console.log(`[Refine] Original : "${rawText}"`);
      console.log(`[Refine] Refined  : "${refined}"`);
      return refined;
    }
  } catch (err) {
    console.warn('[Refine] Azure refinement failed, using original query:', err.message);
  }
  return rawText;
}

async function callLLM(systemPrompt, messages, opts = {}) {
  // Try Anthropic first if key is available
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log('Trying Anthropic...');
      return await callAnthropic(systemPrompt, messages, opts);
    } catch (err) {
      console.warn('Anthropic failed, falling back to Azure OpenAI:', err.message);
    }
  }

  // Fallback to Azure OpenAI
  if (process.env.AZURE_OPENAI_KEY) {
    console.log('Using Azure OpenAI...');
    return await callAzure(systemPrompt, messages, opts);
  }

  throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or AZURE_OPENAI_KEY.');
}

function cleanVadalogCodeBlocks(text) {
  return text.replace(/```(\w*)\n([\s\S]*?)```/g, (fullMatch, lang, code) => {
    const lines = code.split('\n');
    let lastAnnotationIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*@(output|post|bind|model|mapping|param)\s*\(/.test(lines[i])) {
        lastAnnotationIdx = i;
      }
    }
    if (lastAnnotationIdx === -1) return fullMatch;
    const cleaned = lines.slice(0, lastAnnotationIdx + 1).join('\n');
    return '```' + lang + '\n' + cleaned + '\n```';
  });
}

function logEnvCheck() {
  console.log('Environment check:', {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'SET' : 'NOT SET',
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL || '(default: claude-opus-4-6)',
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? 'SET' : 'NOT SET',
    AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY ? 'SET' : 'NOT SET',
    AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT,
  });
}

function extractKeyTerms(query) {
  const cleaned = query.toLowerCase().replace(/[?.,!;:]/g, '');
  const stopWords = ['how', 'do', 'does', 'did', 'i', 'can', 'could', 'would', 'should',
                      'you', 'please', 'show', 'me', 'the', 'a', 'an', 'in', 'to', 'for',
                      'with', 'using', 'use', 'using', 'compute', 'calculate', 'create',
                      'make', 'get', 'find', 'my', 'vadalog', 'prometheux'];
  const words = cleaned.split(/\s+/);
  const keyTerms = words.filter(w => !stopWords.includes(w) && w.length > 2);
  return keyTerms.length > 0 ? keyTerms.join(' ') : cleaned;
}

async function searchAlgolia(query) {
  const algoliasearch = (await import('algoliasearch')).default;
  const client = algoliasearch('DCCC0T0ITC', '870d45e2eaf4483e87c2204607df57c7');
  const index = client.initIndex('prometheux-co');

  const searchQuery = extractKeyTerms(query) || query;
  console.log(`[Algolia] Original query: "${query}"`);
  console.log(`[Algolia] Search query: "${searchQuery}"`);

  const algoliaResults = await index.search(searchQuery, {
    hitsPerPage: 5,
    attributesToRetrieve: ['content', 'hierarchy', 'url'],
    attributesToHighlight: [],
    removeStopWords: true,
  });

  if (algoliaResults.hits.length === 0) {
    console.warn(`[Algolia] No results found for search query: "${searchQuery}"`);
    return { relevantDocs: '', searchResults: [] };
  }

  const topHits = algoliaResults.hits.slice(0, 3);
  const relevantDocs = topHits
    .map((hit) => `## ${hit.hierarchy?.lvl1 || 'Documentation'}\n${hit.content || ''}`)
    .join('\n\n');
  const searchResults = topHits.map(hit => ({
    title: hit.hierarchy?.lvl1 || 'Documentation',
    url: hit.url?.startsWith('http') ? hit.url : `https://docs.prometheux.ai${hit.url || ''}`,
    excerpt: (hit.content || '').substring(0, 200) + '...'
  }));

  console.log(`[Algolia] Found ${algoliaResults.nbHits} total docs, using top ${topHits.length}`);
  console.log('[Algolia] Retrieved sections:', searchResults.map(r => r.title).join(', '));
  console.log(`[Algolia] Total chars injected into prompt: ${relevantDocs.length}`);
  return { relevantDocs, searchResults };
}

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
                logEnvCheck();

                const { query, context, include_docs = true } = req.body;

                const refinedQuery = await refineQuery(query);

                let relevantDocs = '';
                let searchResults = [];
                
                if (include_docs) {
                  try {
                    const algoliaResult = await searchAlgolia(refinedQuery);
                    relevantDocs = algoliaResult.relevantDocs;
                    searchResults = algoliaResult.searchResults;
                  } catch (error) {
                    console.warn('Algolia search failed:', error);
                  }
                }
                
                const systemPrompt = VADALOG_SYSTEM_PROMPT +
                  (context ? `\n\nUSER CONTEXT: ${context}` : '') +
                  (relevantDocs ? `\n\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation as additional reference.` : '');

                const result = await callLLM(systemPrompt, [{ role: 'user', content: refinedQuery }]);

                const cleanedResult = cleanVadalogCodeBlocks(result.text);
                const codeBlocks = [];
                const codeRegex = /```(?:vadalog|prolog)?\n([\s\S]*?)```/g;
                let match;
                while ((match = codeRegex.exec(cleanedResult)) !== null) {
                  codeBlocks.push({
                    language: 'vadalog',
                    code: match[1].trim(),
                    description: 'Vadalog code example'
                  });
                }

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://docs.prometheux.ai' : '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                res.json({
                  response: cleanedResult,
                  code_examples: codeBlocks,
                  relevant_docs: searchResults,
                  metadata: {
                    provider: getProviderLabel(result.provider),
                    model: getModelName(result.provider),
                    tokens_used: result.tokensUsed,
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
                logEnvCheck();

                const { messages } = req.body;

                const latestMessage = messages[messages.length - 1];
                const userQuery = latestMessage?.content || '';

                const refinedQuery = await refineQuery(userQuery);
                
                let relevantDocs = '';
                try {
                  const algoliaResult = await searchAlgolia(refinedQuery);
                  relevantDocs = algoliaResult.relevantDocs;
                } catch (error) {
                  console.warn('Algolia search failed:', error);
                }
                
                const systemPrompt = VADALOG_SYSTEM_PROMPT +
                  (relevantDocs ? `\n\nRELEVANT DOCUMENTATION:\n${relevantDocs}\n\nUse this documentation as additional reference.` : '');

                const chatMessages = messages.filter(m => m.role !== 'system').map(m =>
                  m === latestMessage ? { ...m, content: refinedQuery } : m
                );
                const result = await callLLM(systemPrompt, chatMessages);

                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://docs.prometheux.ai' : '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                const cleanedText = cleanVadalogCodeBlocks(result.text);
                const words = cleanedText.split(' ');
                for (let i = 0; i < words.length; i++) {
                  const word = words[i];
                  const chunk = i === 0 ? word : ' ' + word;
                  res.write(`0:"${chunk.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`);
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