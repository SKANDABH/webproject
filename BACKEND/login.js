    const express = require("express");
    const bodyParser = require("body-parser");
    const mongoose = require("mongoose");

    const app = express();

    mongoose.connect("mongodb://127.0.0.1:27017/logindb", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const userSchema = new mongoose.Schema({
        email: String,
        password: String,
    });

    const User = mongoose.model('User', userSchema);

    app.use(bodyParser.json());

    // Endpoint to handle user registration
    app.post('/login', async function (req, res) {
        try {
            const { email, password } = req.body;
            console.log(email);
            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            // Create a new user
            const newUser = new User({ email, password });

            // Save the user to the database
            
            console.log("About to save user:", newUser);
    await newUser.save();
    console.log("User saved successfully:", newUser);


            res.status(201).json({ message: 'User registered successfully' });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // Endpoint to handle login requests
    app.post('/login', async function (req, res) {
        try {
            const { email, password } = req.body;
    
            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Here, you'd typically compare the provided password with the stored hashed password
            // For simplicity, this example just checks if the provided password matches
            if (user.password === password) {
                return res.json({ message: 'Login successful' });
            } else {
                return res.status(400).json({ message: 'Incorrect password' });
            }

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
