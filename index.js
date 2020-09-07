//последовательная обработка запроса request 
//можно добавлять свойства к запросу – сощная функция

const express = require('express')
const app = express()

var delayInMilliseconds = 1000; //1 second

app.use((request, response, next) => {
    console.log('hi me 1')
    setTimeout(function() {next()}, delayInMilliseconds);
    
})

app.use((request, response, next) => {
    console.log('hi me 2')
    setTimeout(function() {next()}, delayInMilliseconds);
    
})

app.use((request, response, next) => {
    request.chance = Math.random()
    setTimeout(function() {next()}, delayInMilliseconds);
})

app.get('/hi', (request, response) => {
    response.json({
        chance: request.chance
    })
})
app.listen(3000)