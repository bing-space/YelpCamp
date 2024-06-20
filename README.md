# YelpCamp

## Install: 
```
## YelpCamp > npm init -y
##            express 
##            mongoose 
##            ejs 
##            method-override
##            ejs-mate
##            joi
##            connect-flash
##            express-session
##            passport passport-local passport-local-mongoose
##            multer
##            dotenv
##            cloudinary@1.41.3
##            multer-storage-cloudinary@4.0.0
##            multer@1.4.5-lts.1
##            bs-custom-file-input
##            @mapbox/mapbox-sdk
##            express-mongo-sanitize
##            sanitize-html
##            helmet
```

## Start Server
```
> nodemon app.js
```
## Seeding Campground
```
> node seeds/index.js
```
## In Database
```
> mongosh
> use yelp-camp
> db.campgrounds.find({})
> db.reviews.find({})
> db.users.find({})
```
## In Production
```
> NODE_ENV=production node app.js
```



## Folders/Files
> FOLDER: controllers
>> campgrounds.js
>
>> reviews.js
>
>> users.js

> FOLDER: models
>> campground.js
>
>> review.js
>
>> user.js