const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const apiKey = 'AIzaSyBvmu48pJBVdmamS1Ajy5nWzEhE8lDODpw';
    const genAI = new GoogleGenerativeAI(apiKey);

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.0-pro'];

    for (const modelName of models) {
        try {
            console.log(`Probando: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Di hola en una palabra');
            console.log(`EXITO con ${modelName}: ${result.response.text()}`);
            break;
        } catch (e) {
            console.log(`FALLO ${modelName}: ${e.status} - ${String(e.message).slice(0, 100)}`);
        }
    }
}

test().catch(console.error);
