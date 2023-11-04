const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const comment = require('./routes/comment');

// Set 'strictQuery' option to suppress the deprecation warning
mongoose.set('strictQuery', false);

// MongoDB connection
mongoose.connect(config.get('DBHost'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB connected');
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
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
    console.log("Listening on port " + port);
});

module.exports = app; // for testing
