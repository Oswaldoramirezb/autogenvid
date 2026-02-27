const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const apiKey = 'AIzaSyBdBfPZn0HJyYSW2tXvoV18Jo02QgmZFaM';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('Listing available models for this key...');
        const models = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Just to get the object if needed, but listModels is on genAI
        // listModels usually requires an authenticated genAI instance
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const axios = require('axios');
        const resp = await axios.get(url);
        console.log('Available models:');
        resp.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${m.name} (${m.displayName})`);
            }
        });
    } catch (e) {
        console.error('Error listing models:', e.response ? e.response.data : e.message);
    }
}

test();
