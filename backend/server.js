const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // In production, replace with your frontend domain
    credentials: true
}));

// MongoDB connection string - replace with your own if different
const mongoURI = 'mongodb://localhost:27017/solana-distribution';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define registration schema
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, walletAddress, latitude, longitude } = req.body;
        
        const registration = new Registration({
            name,
            email,
            walletAddress,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });

        await registration.save();
        res.status(201).json({ 
            message: 'Registration successful',
            walletAddress 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Route to check registration status
app.get('/api/check/:walletAddress', async (req, res) => {
    try {
        const registration = await Registration.findOne({ 
            walletAddress: req.params.walletAddress 
        });
        
        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }
        
        res.json({ 
            status: 'registered',
            registrationDate: registration.registrationDate
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});