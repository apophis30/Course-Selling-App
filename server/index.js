const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
require('dotenv').config();
const MongoDB_URL = process.env.MongoDB_URL

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter)
app.use("/user", userRouter)


// Connect to MongoDB
mongoose.connect(MongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'courseapp' });

app.listen(3000, () => console.log('Server running on port 3000'));