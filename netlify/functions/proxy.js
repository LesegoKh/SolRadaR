// netlify/functions/proxy.js
const fetch = require('node-fetch');  // Ensure you use node-fetch in your dependencies

exports.handler = async function(event, context) {
    const { mintAddress } = event.queryStringParameters;
    const apiUrl = `https://external-api.example.com/data/${mintAddress}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',  // Allow any origin
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching data' }),
        };
    }
};
