const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const upload = multer({ dest: 'uploads/' });


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/ai', upload.single('file'), async (req, res) => {
  try {
    console.log("API called with message:", req.body.message);
    let prompt = req.body.message;

    // If a file is uploaded, include its path in the prompt
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);
      prompt += ` (Attached file: ${filePath})`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server started on port');
});
