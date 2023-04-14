const express = require('express');
require('dotenv').config()
const connectDB = require('./config/db');

const app = express();

//connect to DB
connectDB();


//middlewares
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    res.send("Hello World");
  } catch (err) {
    res.status(500).send('Server Error', err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
