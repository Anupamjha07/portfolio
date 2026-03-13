const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Authentication required');
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString()
        .split(':');

    const user = auth[0];
    const pass = auth[1];

    if (user === 'anupam' && pass === 'admin@123') {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Access denied');
    }
};

// Protect Dashboard
app.get('/dashboard.html', basicAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Helper functions
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Get Projects
app.get('/api/projects', (req, res) => {
    const db = readDB();
    res.json(db.projects);
});

// Get Messages
app.get('/api/messages', basicAuth, (req, res) => {
    const db = readDB();
    res.json(db.messages);
});

// Add Project
app.post('/api/projects', basicAuth, (req, res) => {
    const db = readDB();

    const newProject = {
        id: Date.now(),
        ...req.body
    };

    db.projects.push(newProject);
    writeDB(db);

    res.json({ success: true, project: newProject });
});

// Contact Form
app.post('/api/contact', (req, res) => {
    const db = readDB();

    const newMessage = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        ...req.body
    };

    db.messages.push(newMessage);
    writeDB(db);

    res.json({ success: true, message: "Message received!" });
});

// Scrape URL Metadata
app.post('/api/scrape', basicAuth, async (req, res) => {
    const { url } = req.body;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title =
            $('meta[property="og:title"]').attr('content') ||
            $('title').text() ||
            'No Title Found';

        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            'No Description Found';

        let image =
            $('meta[property="og:image"]').attr('content') || '';

        if (image && !image.startsWith('http')) {
            const urlObj = new URL(url);
            image = urlObj.origin + image;
        }

        res.json({ title, description, image });

    } catch (error) {
        console.error("Scraping Error:", error.message);
        res.status(500).json({
            error: "Failed to scrape URL."
        });
    }
});

// Delete Project
app.delete('/api/projects/:id', basicAuth, (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);

    const initialLength = db.projects.length;

    db.projects = db.projects.filter(p => p.id !== id);

    if (db.projects.length === initialLength) {
        return res.status(404).json({ error: "Project not found" });
    }

    writeDB(db);
    res.json({ success: true });
});

// Delete Message
app.delete('/api/messages/:id', basicAuth, (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);

    const initialLength = db.messages.length;

    db.messages = db.messages.filter(m => m.id !== id);

    if (db.messages.length === initialLength) {
        return res.status(404).json({ error: "Message not found" });
    }

    writeDB(db);
    res.json({ success: true });
});

// Experience APIs
app.get('/api/experience', (req, res) => {
    const db = readDB();
    res.json(db.experience || []);
});

app.post('/api/experience', basicAuth, (req, res) => {
    const db = readDB();

    if (!db.experience) db.experience = [];

    const newJob = {
        id: Date.now(),
        ...req.body
    };

    db.experience.push(newJob);
    writeDB(db);

    res.json({ success: true, job: newJob });
});

app.delete('/api/experience/:id', basicAuth, (req, res) => {
    const db = readDB();

    if (!db.experience)
        return res.status(404).json({ error: "No experience found" });

    const id = parseInt(req.params.id);

    const initialLength = db.experience.length;

    db.experience = db.experience.filter(j => j.id !== id);

    if (db.experience.length === initialLength) {
        return res.status(404).json({ error: "Job not found" });
    }

    writeDB(db);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
