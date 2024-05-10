const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6000;

// Sabit verilerin bulunduğu dosyanın yolu
const dataPath = path.join(__dirname, 'server/urls.json');

// API endpoint'i
app.get('/api/images', async (req, res) => {
    try {
        // Sabit verileri dosyadan oku
        const data = await fs.readFile(dataPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sunucuyu dinle
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
