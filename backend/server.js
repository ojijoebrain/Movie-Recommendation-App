const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

//
// ✅ Middleware Configuration
//
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true // allow cookies and auth headers
}));
app.use(express.json()); // for parsing application/json

//
// ✅ Routes
//
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('🎬 Welcome to  Flick API');
});

// 404 fallback handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//
// ✅ MongoDB Connection & Server Startup
//
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
