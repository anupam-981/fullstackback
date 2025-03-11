const mongoose = require('mongoose');

const password = "anu123pam";  // Replace with an environment variable in production
const dbName = "phonebook";
const uri = `mongodb+srv://anupamvijay981:${password}@cluster0.tibqe.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Connect with proper error handling
mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }) // Wait 10 seconds before timeout
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ Connection error:", err);
        process.exit(1);
    });

// Define Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

// Handling command-line arguments
const args = process.argv;

if (args.length === 3) {
    // List all contacts
    Person.find({})
        .then(persons => {
            console.log("📖 Phonebook entries:");
            persons.forEach(person => console.log(`${person.name} ${person.number}`));
            mongoose.connection.close();
        })
        .catch(err => {
            console.error("❌ Error fetching data:", err);
            mongoose.connection.close();
        });
} else if (args.length === 5) {
    // Add a new contact
    const name = args[3];
    const number = args[4];

    const person = new Person({ name, number });

    person.save()
        .then(() => {
            console.log(`✅ Added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        })
        .catch(err => {
            console.error("❌ Error saving to database:", err);
            mongoose.connection.close();
        });
}
