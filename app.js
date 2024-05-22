const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session =  require('express-session')
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() =>{
        console.log("Connection Open")
    })
    .catch(err => {
        console.log("Error.......")
        console.log(err)
    })
// Middleware
app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

const sessionConfig = {
    secret: 'thisisnotagoodsecret', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge: 100 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// Connect-flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next();
})

// Get home page: GET
app.get('/', (req, res) => {
    res.render('home')
})

// Campground Section ------------------
app.use('/campgrounds', campgrounds)

// Review Section ------------------
app.use('/campgrounds/:id/reviews', reviews)

// Handle Error
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})