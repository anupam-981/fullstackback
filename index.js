const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PhonebookEntry = require("./models/phonebookentry");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ GET all entries
app.get("/api/persons", async (req, res) => {
  try {
    const entries = await PhonebookEntry.find({});
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

// ✅ GET a single entry by ID
app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const entry = await PhonebookEntry.findById(req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  } catch (error) {
    next(error);
  }
});

// ✅ POST a new entry
app.post("/api/persons", async (req, res, next) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({ error: "Name and number are required!" });
    }

    const existingEntry = await PhonebookEntry.findOne({ name });
    if (existingEntry) {
      existingEntry.number = number;
      const updatedEntry = await existingEntry.save();
      return res.json(updatedEntry);
    }

    const newEntry = new PhonebookEntry({ name, number });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    next(error);
  }
});

// ✅ PUT - Update an entry
app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;

  const updatedData = { name, number };
  try {
    const updatedEntry = await PhonebookEntry.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// ✅ DELETE an entry
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const deletedEntry = await PhonebookEntry.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// ✅ /info route
app.get("/info", async (req, res) => {
  try {
    const count = await PhonebookEntry.countDocuments({});
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Error:", error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Malformed ID" });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
