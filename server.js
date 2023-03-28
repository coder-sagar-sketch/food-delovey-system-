require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')




//databse connection

const url = 'mongodb://localhost/pizza';
mongoose.connect( url, { useNewUrlParser: true,  useUnifiedTopology: true  })
.then( () => console.log("connection successfull...."))
.catch( (err) =>console.log(err));
/* const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
})
.catch(er => console.log( err));
 */




app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views') )
app.set('view engine', 'ejs')







//session store
/* let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
}) */

//session-config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave : false,  
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized: false,
    cookie:{maxAge: 1000*60*60*24} //24 hours
    
}));

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());


app.use(flash())


//Assests 
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//global middleware
app.use((req, res, next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

require('./routes/web')(app)





app.listen(3000, ()=>{
    console.log(`listening on port ${PORT}`)
})