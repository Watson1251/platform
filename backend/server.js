const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your Angular app's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully.' });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
