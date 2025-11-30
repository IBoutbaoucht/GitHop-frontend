
const API_BASE_URL = 'http://51.107.0.46';

export async function onRequest(context) {
    const url = new URL(context.request.url);

    if (url.pathname.startsWith('/api')) {
        // We need to strip the leading slash for the URL constructor
        const destinationPath = url.pathname + url.search;
        // Use a simple concatenation for reliability if the base URL doesn't end in a slash
        const destinationURL = API_BASE_URL + destinationPath; 
        
        const response = await fetch(destinationURL, context.request);
        return response;
    }

    return context.next();
}