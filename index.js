const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// MongoDB connection
const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://testMern:testMern@cluster0.uukdttn.mongodb.net/testMern', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  textAreas: [{ type: String }]  // Field to store multiple text areas
});
const UserModel = mongoose.model('User', userSchema);

// Register route
app.post('/user/register', async (req, res) => {
  try {
    const { textAreas } = req.body;

    if (!Array.isArray(textAreas) || textAreas.some(text => typeof text !== 'string')) {
      return res.status(400).send("Invalid textAreas format");
    }

    const user = new UserModel({ textAreas });
    await user.save();
    return res.status(201).send(user);

  } catch (error) {
    console.error("Error creating User:", error.message);
    return res.status(500).send("Error Saving Text Areas");
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, async () => {
  try {
    console.log(`Server is listening on port ${PORT}`);
    await connection();
  } catch (err) {
    console.error("Error in connection:", err);
  }
});
