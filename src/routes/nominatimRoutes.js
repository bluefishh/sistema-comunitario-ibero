const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Router para hacer la petición a la API Nominatim y traer las comunidades
router.get('/search', async (req, res) => {
    const q = req.query.q || '';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Colombia')}&addressdetails=1&limit=10`;
    try {
        const response = await fetch(url, {
            headers: { 'Accept-Language': 'es', 'User-Agent': 'tu-app/1.0' }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar Nominatim' });
    }
});

module.exports = router;