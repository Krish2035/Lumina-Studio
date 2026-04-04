const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Essential to parse the 3D data JSON

// Routes
app.use('/api/projects', projectRoutes);

// MongoDB Connection (Replace with your local URI or Atlas String)
const MONGO_URI = 'mongodb+srv://krishpadshala2035_db_user:Krish%40047@luminastudiocluster.6isnzcr.mongodb.net/?appName=LuminaStudioCluster';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Lumina Database Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});