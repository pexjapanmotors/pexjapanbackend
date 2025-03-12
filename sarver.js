const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Root route
app.get('/', (req, res) => {
  res.send('Cloudinary Image Deletion API is running.');
});

// Delete image from Cloudinary
app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body;

  console.log('Received request to delete:', public_id);

  if (!public_id) {
    console.error('No public_id provided.');
    return res.status(400).json({ error: 'Public ID is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Cloudinary response:', result);

    if (result.result === 'not found') {
      return res.status(404).json({ error: 'Image not found on Cloudinary' });
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});