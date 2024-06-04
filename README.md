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

## Create VIEWS FOLDER
1. home.ejs
2. error.ejs
## --- Campgrounds Folder
1. campground.ejs
2. show.ejs
3. new.ejs
4. edit.ejs
## --- Layout Folder
1. boilerplate.ejs
## --- Partials Folder
1. navbar.ejs

## Create Models FOLDER
1. campground.js
2. review.js

## Create Utils FOLDER
1. catchAsync.js
2. ExpressError.js

# Create Routes FOLDER
1. campgrounds.ejs
2. reviews.js

# Create Public FOLDER
1. javascripts
    1. validateForms.js
2. stylesheets