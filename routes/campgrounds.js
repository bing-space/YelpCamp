const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js')

const validateCampground = (req,res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

// Create new campground - get the form: GET
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// Create new campground - post the form: POST
router.post('/',validateCampground, catchAsync(async (req, res) => { 
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success','Successfully made a new campground')
    // console.log(newCamp);
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
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/show', {campground})
}))

// Update campground - get the form with data: GET
router.get('/:id/edit',catchAsync( async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit', {campground})
}))

// Update campground - update data: PUT
router.put('/:id',validateCampground, catchAsync( async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    req.flash('success','Successfully updated a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Deletes campground
router.delete('/:id',catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')

    res.redirect('/campgrounds');
}))

module.exports = router;