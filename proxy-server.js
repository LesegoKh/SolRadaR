import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Allow all CORS requests to the proxy server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Proxy request for metadata
app.get('/proxy/metadata/:mintAddress', async (req, res) => {
    try {
        const mintAddress = req.params.mintAddress;
        const response = await fetch(`https://api.pump.fun/metadata/${mintAddress}`);
        const data = await response.json();

        // Forward the CORS headers from the original API
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching metadata' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
