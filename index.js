const express = require('express')
const app = express()

var delayInMilliseconds = 1000; //1 second

app.get('/', (request, response, next) => {
    setTimeout(function() {console.log('ha-ha-ha')}, delayInMilliseconds); //now works 
    response.send('everything works because'+request.param('status'))
    // setTimeout(function() {console.log('ha-ha-ha')}, delayInMilliseconds); //isn't work
})

app.get('/err', (request, response, next) => {
    throw new Error('oops')
    // setTimeout(function() {console.log('ha-ha-ha')}, delayInMilliseconds); //isn't work
    // 
})

app.use((err, request, response, next) => {
    // логирование ошибки, пока просто console.log
    console.log(err)
    response.status(500).send('Something broke!')
})
app.listen(3000)