const express = require('express');
const fetch = require('node-fetch');
const app = express();

// CORS headers to allow requests from any origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Endpoint to fetch metadata for a mint address
app.get('/proxy/metadata/:mintAddress', async (req, res) => {
    try {
        const mintAddress = req.params.mintAddress;
        const response = await fetch(`https://api.pump.fun/metadata/${mintAddress}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching metadata' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
