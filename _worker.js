// _worker.js

const API_BASE_URL = 'http://51.107.0.46';

export async function onRequest(context) {
    const url = new URL(context.request.url);

    // 1. Check if the request path starts with /api
    if (url.pathname.startsWith('/api')) {
        // 2. Construct the full HTTP URL for the backend
        const destinationURL = new URL(url.pathname + url.search, API_BASE_URL);

        // 3. Clone the request and forward it to the HTTP backend
        const response = await fetch(destinationURL.toString(), context.request);
        
        // 4. Return the response directly
        return response;
    }

    // If the path doesn't start with /api, proceed to serve static assets (your React app)
    return context.next();
}