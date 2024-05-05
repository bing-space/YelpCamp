const express = require('express');
const app = express();
const Campground = require('./models/campground');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const engine = require('ejs-mate');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() =>{
        console.log("Connection Open")
    })
    .catch(err => {
        console.log("Error.......")
        console.log(err)
    })

app.engine('ejs', engine);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


// Get home page: GET
app.get('/', (req, res) => {
    res.render('home')
})

// Create new campground - get the form: GET
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// Create new campground - post the form: POST
app.post('/campgrounds', async (req, res) => { 
    const newCamp = new Campground(req.body);
    await newCamp.save();
    console.log(newCamp);
    // Redirect
    res.redirect(`/campgrounds/${newCamp._id}`)
})

// Get campgrounds list: GET
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

// Show campground detail: GET
app.get('/campgrounds/:id', async function( req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground})
})

// Update campground - get the form with data: GET
app.get('/campgrounds/:id/edit', async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
})

// Update campground - update data: PUT
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true})
    res.redirect(`/campgrounds/${campground._id}`);
})
// Deletes campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})