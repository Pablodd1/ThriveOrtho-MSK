
import app from '../src/index';

// Mock DB Cache
const cache = new Map();

// Mock DB
const mockDB = {
  prepare: (query: string) => {
    return {
      bind: (...args: any[]) => {
        return {
          first: async () => {
            if (query.toLowerCase().includes('select') && query.includes('gemini_cache')) {
               // Assuming query binds hash as the first argument or so.
               // Since we don't know the exact order yet, let's just assume args[0] is the hash if it looks like a hash
               const hash = args.find(a => typeof a === 'string' && a.length === 64);
               if (hash) {
                 return cache.get(hash) || null;
               }
            }
            return null;
          },
          run: async () => {
             if (query.toLowerCase().includes('insert') && query.includes('gemini_cache')) {
                // INSERT INTO gemini_cache (id, hash, prompt, response) VALUES (?, ?, ?, ?)
                // We need to capture the hash and response
                const hash = args.find(a => typeof a === 'string' && a.length === 64);
                const response = args.find(a => typeof a === 'string' && a.startsWith('{'));

                if (hash && response) {
                   cache.set(hash, { hash, response });
                }
             }
          },
          all: async () => ({ results: [] })
        };
      }
    };
  }
};

// Mock Fetch
const originalFetch = global.fetch;
global.fetch = (async (url: string | Request | URL, init?: RequestInit) => {
  if (url.toString().includes('generativelanguage.googleapis.com')) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
    return new Response(JSON.stringify({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              score: 3,
              compensations: ['Mock compensation'],
              recommendations: ['Mock recommendation']
            })
          }]
        }
      }]
    }));
  }
  if (originalFetch) return originalFetch(url, init);
  return new Response('Not Found', { status: 404 });
}) as any;

async function runBenchmark() {
  const env = {
    GEMINI_API_KEY: 'test-key',
    DB: mockDB as any
  };

  const payload = {
    movement: 'Squat',
    imageBase64: 'fake-image-data',
    analysisType: 'movement' // Ensure this matches logic in analyze-joints
  };

  console.log('Running 1st request (Expect ~1000ms)...');
  const start1 = Date.now();
  await app.request('/api/ai/analyze-joints', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  }, env);
  const end1 = Date.now();
  const time1 = end1 - start1;
  console.log(`1st request took ${time1}ms`);

  console.log('Running 2nd request (Expect cached <50ms)...');
  const start2 = Date.now();
  await app.request('/api/ai/analyze-joints', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  }, env);
  const end2 = Date.now();
  const time2 = end2 - start2;
  console.log(`2nd request took ${time2}ms`);

  if (time1 > 900 && time2 < 100) {
      console.log('SUCCESS: Caching improvement verified.');
  } else {
      console.log('WARNING: Performance did not meet expectations (Baseline established but improvement not yet implemented or verified).');
  }
}

runBenchmark().catch(console.error);
