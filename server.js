const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // This is the PostgreSQL tool
require('dotenv').config();

const aiRoutes = require('./routes/ai'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to your Neon Database using the secret URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// AI Route
app.use('/api/ai', aiRoutes);

// NEW: Contact Form Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  try {
    // Insert the data securely into the SQL table we created
    await pool.query(
      'INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    res.status(201).json({ success: true, message: 'Message securely saved to database!' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to connect to database.' });
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.send('Backend is running smoothly! AI and Database are wired up.');
});

app.listen(PORT, () => {
  console.log(`Server operating on port ${PORT}`);
});