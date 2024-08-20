
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// User model
const userSchema = new mongoose.Schema({
  textAreas: [{ type: String }]  // Field to store multiple text areas
});

const UserModel = mongoose.model('User', userSchema);

// Register route
app.post('/user/register', async (req, res) => {
  try {
    const { textAreas } = req.body;  // Only expect textAreas
    const user = new UserModel({
      textAreas  // Save text areas
    });
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    console.log(error, "Error creating User");
    return res.status(500).send("Error Saving Text Areas");
  }
});

// Get all users route
app.get('/user', async (req, res) => {
  try {
    const users = await UserModel.find();  // Retrieve all users (with textAreas)
    return res.status(200).send(users);
  } catch (error) {
    console.log(error, "Error fetching users");
    return res.status(500).send("Error Fetching Users");
  }
});

// Start the server
app.listen(PORT, async () => {
  try {
    console.log(`Server is listening on port ${PORT}`);
    await connection();
  } catch (err) {
    console.log(err, "Error in connection");
  }
});
