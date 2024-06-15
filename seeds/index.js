const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection Open")
    })
    .catch(err => {
        console.log("Error.......")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({}) // Delete Everything
    for(let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
            author:'665672ff24c916c1d1434936',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'It can also be successfully used as a daily exercise to get writers to begin writing. Being shown a random sentence and using it to complete a paragraph each day can be an excellent way to begin any writing session.',
            price,
            geometry: { type: 'Point', coordinates: [ -75.16401, 39.950886 ] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgz0byy28/image/upload/v1717892440/YelpCamp/znx8zngxwna0tyuvwzlh.avif',
                    filename: 'YelpCamp/znx8zngxwna0tyuvwzlh'
                  },
                  {
                    url: 'https://res.cloudinary.com/dgz0byy28/image/upload/v1717892440/YelpCamp/vbflxzn93uj9isadwret.jpg',
                    filename: 'YelpCamp/vbflxzn93uj9isadwret'
                  }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})