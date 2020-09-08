// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const app = express()
const fs = require('fs')

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('static'));
app.use(express.json())

app.post('/users', urlencodedParser, function (req, res) {
  if(!req.body) 
    return res.sendStatus(400);
  fs.appendFile('users.txt', JSON.stringify({name: req.body.name, age: req.body.age }), (err) => {  
    res.send(req.body.name + " - " + req.body.age + ': successfully registered')
  })
})

app.get('/blog', (request, response) => {
    response.render('blog/blog')
})

app.get('/', (request, response) => {
    response.render('home/home', {
        json: 'here'
    })
})

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.use((err, request, response, next) => {
    // логирование ошибки, пока просто console.log
    console.log(err)
    response.status(500).send('Something broke!')
}) // здесь ок

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.listen(3000)