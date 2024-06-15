const { model } = require('mongoose');
const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const goecoder = mbxGeocoding({accessToken: mapBoxToken})
const { cloudinary } = require('../cloudinary');
const campground = require('../models/campground');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => { 
    const geoData = await goecoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success','Successfully made a new campground')
    console.log(newCamp);
    // Redirect
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCampground = async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}