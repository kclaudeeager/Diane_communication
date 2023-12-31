const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 8080;
const comment = require('./routes/comment');

// Set 'strictQuery' option to suppress the deprecation warning
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to our commenting!" }));
app.route("/comment")
    .get(comment.getComments)
    .post(comment.postComment);
app.route("/comment/:id")
    .get(comment.getComment)
    .delete(comment.deleteComment)
    .put(comment.updateComment);

// Start the server
app.listen(port, () => {
    console.log(`Listening on port at localhost:${port}`);
});

module.exports = app; // for testing
