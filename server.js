const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/customer-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'customer-details.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
