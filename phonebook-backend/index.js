const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend requests

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Generate a unique ID
const generateId = () => Math.floor(Math.random() * 1000000).toString();

// Route to get all phonebook entries
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Route to add a new phonebook entry
app.post('/api/persons', (req, res) => {
    console.log('Incoming request:', req.body); // Debugging

    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'Name and number are required' });
    }

    if (persons.find(p => p.name === name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: generateId(),
        name,
        number
    };

    persons.push(newPerson);
    res.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
