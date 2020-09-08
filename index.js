// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const fs = require('fs')

'use strict'
const pg = require('pg')
const conString = 'postgres://egorkrasilnikov:@localhost/node_hero' // Убедитесь, что вы указали данные от вашей базы данных

const app = express()

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('static'));
app.use(express.json())

app.post('/users', urlencodedParser, function (req, res, next) {
  const user = req.body
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function (err, result) {
      done() // Этот коллбек сигнализирует драйверу pg, что соединение может быть закрыто или возвращено в пул соединений
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.status(200).send('user added')
    })
  })
})

app.get('/users', function (req, res, next) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.json(result.rows)
    })
  })
})

// app.post('/users', urlencodedParser, function (req, res) {
//   if(!req.body) 
//     return res.sendStatus(400);
//   fs.appendFile('users.txt', JSON.stringify({name: req.body.name, age: req.body.age }), (err) => {  
//     res.send(req.body.name + " - " + req.body.age + ': successfully registered')
//   })
// })

app.get('/blog', (request, response) => {
  pg.connect(conString, function (err, client, done) {
    
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      console.log(result.rows)
      response.render('blog/blog', {users : result.rows})
    })

  })
})

app.get('/', (request, response) => {

  pg.connect(conString, function (err, client, done) {
    
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      console.log(result.rows)
      response.render('home/home', {users : result.rows})
    })

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