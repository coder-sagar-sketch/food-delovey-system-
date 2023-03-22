const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000



app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views') )
app.set('view engine', 'ejs')


//Assests
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/cart', (req, res)=>{
    res.render('customers/cart')
})


app.listen(3000, ()=>{
    console.log(`listening on port ${PORT}`)
})