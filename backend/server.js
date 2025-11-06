const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
// Use the port provided by the hosting environment or 3001 for local development
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(express.json());

// --- MOCK DATA FOR QUOTES (Simplest Module) ---
const motivationalQuotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Strive not to be a success, but rather to be of value. – Albert Einstein",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "The mind is everything. What you think you become. – Buddha",
    "Don't watch the clock; do what it does. Keep going. – Sam Levenson"
];

// --- 1. Motivational Quote Generator API ---
app.get('/api/quote', (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        const quote = motivationalQuotes[randomIndex];
        res.json({ quote: quote });
    } catch (error) {
        console.error('Quote generation failed:', error);
        res.status(500).json({ error: 'Failed to generate quote.' });
    }
});

// --- 2. Currency Conversion API (INR -> USD/EUR) ---
// Using a mock conversion for simplicity and reliable deployment
const conversionRates = {
    USD: 0.012, // 1 INR = 0.012 USD (approx)
    EUR: 0.011  // 1 INR = 0.011 EUR (approx)
};

app.post('/api/convert', (req, res) => {
    const { amount, target } = req.body;

    // Graceful Input Handling
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount: Must be a positive number.' });
    }
    if (!['USD', 'EUR'].includes(target)) {
        return res.status(400).json({ error: 'Invalid target currency. Must be USD or EUR.' });
    }

    try {
        const rate = conversionRates[target];
        const convertedAmount = amount * rate;
        
        res.json({
            amount: amount,
            from: 'INR',
            to: target,
            rate: rate,
            converted: parseFloat(convertedAmount.toFixed(4))
        });
    } catch (error) {
        console.error('Conversion failed:', error);
        res.status(500).json({ error: 'Conversion service error.' });
    }
});

// --- 3. Weather Information API (Using Open-Meteo for NO API KEY setup) ---
// Note: This API requires coordinates. For simplicity, we use a static city (e.g., London).
// To look up coordinates by city name, you'd need an extra geocoding API call.

app.get('/api/weather', async (req, res) => {
    // For the challenge, we use a hardcoded city for simplicity:
    const city = req.query.city || 'London';
    const latitude = 51.5085; // London Coordinates
    const longitude = -0.1257; 

    // Open-Meteo API: No key needed, but requires coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=GMT`;

    try {
        const response = await axios.get(weatherUrl);
        const data = response.data.current;

        const weatherInfo = {
            city: city,
            temperature: `${data.temperature_2m} °C`,
            windSpeed: `${data.wind_speed_10m} km/h`,
            // Simple logic to interpret the weather code (for presentation)
            condition: data.temperature_2m > 15 ? 'Clear/Warm' : 'Cloudy/Cold'
        };
        
        res.json(weatherInfo);

    } catch (error) {
        console.error('Weather API request failed:', error.message);
        // Neatly handle API failure
        res.status(500).json({ error: 'Failed to fetch weather data. Try again later.' });
    }
});


// Fallback route for Vercel deployment
app.get('*', (req, res) => {
    res.send('InfoHub Backend is running.');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
