const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

// Create new campground - get the form: GET
router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// Create new campground - post the form: POST
router.post('/',validateCampground, isLoggedIn, catchAsync(async (req, res) => { 
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success','Successfully made a new campground')
    console.log(newCamp);
    // Redirect
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

// Get campgrounds list: GET
router.get('/',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// Show campground detail: GET
router.get('/:id',catchAsync( async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/show', {campground})
}))

// Update campground - get the form with data: GET
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync( async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit', {campground})
}))

// Update campground - update data: PUT
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    req.flash('success','Successfully updated a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Deletes campground
router.delete('/:id',isLoggedIn,isAuthor, catchAsync( async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')

    res.redirect('/campgrounds');
}))

module.exports = router;