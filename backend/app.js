const express = require('express');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(express.json());




module.exports = app;