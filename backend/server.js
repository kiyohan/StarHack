const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/users', require('./routes/users'));
app.use('/api/activities', require('./routes/activities'));

// --------------------------------


// Whitelist the URLs that are allowed to make requests to this API
const corsOptions = {
    origin: [
        'http://localhost:5173', // Your local frontend for testing
        'https://star-hack.vercel.app/' 
    ]
};
app.use(cors(corsOptions));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));