const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const indexRoute = require('./src/routes/index');
const app = express();
const PORT = process.env.PORT || 5000;

// ejs setup
app.use(expressLayouts);
app.set('layout','./layout/layout');
app.set('view engine', 'ejs');

// express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.use('/', indexRoute);

app.listen(PORT, () => console.log('Server running...'))