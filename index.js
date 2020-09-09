// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const fs = require('fs')
var formidable = require('formidable');

'use strict'
const pg = require('pg');
const { isContext } = require('vm');
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

app.get('/blog', (request, response) => {
  pg.connect(conString, function (err, client, done) {
    
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    
    client.query(
      `SELECT blog_name, image_url FROM blogs 
      ORDER BY blog_name;`, 
      [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      response.render('blog/blog', {blogs : result.rows})
    })

  })
})

app.post('/upload', (request, response) => {

  var form = new formidable.IncomingForm();
  form.parse(request, function (err, fields, files) {
    var oldpath = files.file.path;
    var newpath = 'static/' + 'icon.jpg';
    console.log(request);
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err; //return next(err);
      response.redirect('back');   
    });
  });
})

app.get('/', (request, response, next) => {

  pg.connect(conString, function (err, client, done) {
    
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query(
      `SELECT blog_name, image_url FROM blogs 
      ORDER BY blog_name
      LIMIT 3;`, 
      [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      response.render('home/home', {blogs : result.rows})
    })
  })
})

app.get('/blog/add', (request, response, next) => {
  response.render('blog/add')
})

app.post('/blog/add', (request, response, next) => {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }

    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      var oldpath = files.image.path;
      var newpath = 'static/upload/' + files.image.name.replace(/ /g,'');
      db_path = 'upload/' + files.image.name.replace(/ /g,'');
      fs.rename(oldpath, newpath, function (err) {
        if (err) return next(err);

        client.query('INSERT INTO blogs (blog_name, image_url) VALUES ($1, $2);', [fields.blog_name, db_path], function (err, result) {
          done() 
          if (err) {
            // Передача ошибки в обработчик express
            return next(err)
          }
          response.redirect('/blog');
        })
      });
    });
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