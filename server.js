const express = require("express");
const morgan = require("morgan");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 4000;

const todoRoutes = require('./routes/TodoRoutes');
const userRoutes = require('./routes/UserRoutes');

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
};

app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/', todoRoutes);
app.use('/api/v1/', userRoutes);

mongoose
    .connect("mongodb://127.0.0.1:27017/tododb")
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.error("Error connecting to database"));

// Add a fallback route
app.use((req, res, next) => {
    res.status(404).send('Endpoint not found');
});

app.listen(port, function () {
    console.log("Server is running on port " + port);
});
