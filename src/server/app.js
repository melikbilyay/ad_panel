const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path/posix');
const app = express();

app.use(cors());

const people = [
    { id: 1, workingHours: { start: 1, end: 10 } },
    { id: 2, workingHours: { start: 10, end: 20 } },
    { id: 3, workingHours: { start: 21, end: 23 } },
    { id: 4, workingHours: { start: 24, end: 1 } },
];

const getImageUrl = async (id) => {
    try {
        const data = await fs.readFile('urls.json', 'utf8');
        const urls = JSON.parse(data);
        return urls[`${id}.png`];
    } catch (error) {
        console.error('Error fetching image URL for id:', id, error);
        return null;
    }
};

app.get('/people', async (req, res) => {
    try {
        const urlsData = await fs.readFile(path.join(__dirname, 'server/urls.json'), 'utf8');
        const urls = JSON.parse(urlsData);

        const combinedData = people.map(person => {
            const matchingUrl = urls.find(url => url.id === person.id);
            return { ...person, url: matchingUrl ? matchingUrl.url : null };
        });

        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching people:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/image/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const imageUrl = await getImageUrl(id);
        res.json(imageUrl);
    } catch (error) {
        console.error('Error fetching image URL for id:', id, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
