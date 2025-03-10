
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string_here';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Check for MongoDB connection status
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection lost:', err);
});
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected! Retrying...');
});
mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected!');
});

// ✅ Define Mongoose Schema & Model
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
const Person = mongoose.model('Person', personSchema);

// ✅ GET all people
app.get('/api/people', async (req, res) => {
    try {
        const people = await Person.find({});
        res.json(people);
    } catch (error) {
        console.error('❌ Error fetching people:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ POST: Add a new person
app.post('/api/people', async (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number missing' });
    }
    
    try {
        const existingPerson = await Person.findOne({ name });
        if (existingPerson) {
            return res.status(400).json({ error: 'Name already exists' });
        }

        const person = new Person({ name, number });
        const savedPerson = await person.save();
        console.log(`✅ Added: ${name} - ${number}`);
        res.json(savedPerson);
    } catch (error) {
        console.error('❌ Error saving person:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// ✅ DELETE a person
app.delete('/api/people/:id', async (req, res) => {
    try {
        const deletedPerson = await Person.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log(`🗑️ Deleted: ${deletedPerson.name}`);
        res.status(204).end();
    } catch (error) {
        console.error('❌ Error deleting person:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
