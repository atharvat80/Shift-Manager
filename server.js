const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express(),
    fs = require('fs');

let users = JSON.parse(fs.readFileSync('users.json'));

app.use(cors());
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('./index.html');
})

app.get('/shifts', (req, res) => {
    data = JSON.parse(fs.readFileSync(`./data/${req.query.user}.json`));
    res.send(data);
})

app.get('/getWage', (req, res) => {
    res.send(`${users[req.query.user].wage}`);
})

app.post('/setWage', (req, res) => {
    users[req.body.user].wage = req.body.wage;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send("Wage updated");
})

app.post('/save', (req, res) => {
    fs.writeFile(`./data/${req.body.user}.json`, req.body.data, () => {
        console.log("changes saved");
    })
    res.send('changes saved');
})

app.post('/login', (req, res) => {
    if (users[req.body.username] === undefined) {
        res.statusCode = 404;
        res.send('User not found')
    } else if (users[req.body.username] !== undefined && users[req.body.username].password === req.body.password) {
        res.statusCode = 200;
        res.send('Login successful')
    } else {
        res.statusCode = 401;
        res.send('Incorrect password')
    }
})

app.post('/signup', (req, res) => {
    if (users[req.body.username] === undefined) {
        users[req.body.username] = {"password": req.body.password, "wage":6.45};
        res.statusCode = 200;
        res.send("Account created");
        fs.writeFileSync('users.json', JSON.stringify(users));
        fs.writeFileSync(`./data/${req.body.username}.json`, JSON.stringify({}));
    } else {
        res.statusCode = 400;
        res.send("Username taken")
    }
})

const port = 8000;
app.listen(port);