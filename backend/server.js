require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const logRoutes = require('./routes/logRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const path = require('path');

app.use('/api/students', studentRoutes);
app.use('/api/logs', logRoutes);

// --- Production Ready Frontend Hosting ---
// Serve frontend statically right out of the backend container
app.use(express.static(path.join(__dirname, '../frontend')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
