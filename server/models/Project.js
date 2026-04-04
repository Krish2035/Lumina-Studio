const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    default: "New Lumina Project" 
  },
  theme: { 
    type: String, 
    default: "default" 
  },
  // We store the shapes array exactly as it exists in your Zustand store
  shapes: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [] 
  },
  // Keyframes are an object where keys are shape IDs
  keyframes: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  lastModified: { 
    type: Date, 
    default: Date.now 
  }
}, { minimize: false }); // 'minimize: false' ensures empty objects are saved

module.exports = mongoose.model('Project', ProjectSchema);