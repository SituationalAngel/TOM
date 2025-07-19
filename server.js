const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = 3001; // Or any port you want

app.use(cors());

app.get('/api/flights', async (req, res) => {
    const url = 'https://opensky-network.org/api/states/all';

    const options = process.env.OPENSKY_USER && process.env.OPENSKY_PASS
    ? {
        headers: {
            Authorization:
            'Basic ' +
            Buffer.from(
                `${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}`
            ).toString('base64'),
        },
    }
    : {};

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Upstream error' });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Proxy fetch failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Flight proxy running at http://localhost:${PORT}`);
});
