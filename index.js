// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const app = express()

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('static'));
app.use(express.json())

app.post('/users', urlencodedParser, function (req, res) {
  // извлекаем данные пользователя из тела запроса
  // console.log(req)
  if(!req.body) 
    return res.sendStatus(400);
  console.log(req.body);
  res.send(req.body.userName + " - " + req.body.userAge);
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