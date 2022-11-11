const fetch = require("node-fetch")
const ObjectID = require('mongodb').ObjectID
module.exports = function (app, passport, db) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // message board routes ===============================================================

    app.get('/cart', async (req, res) => {

        const result = await db.collection('cart').find().toArray()
        res.render('cart.ejs', { cart: result })
    })


    //https://jsonplaceholder.typicode.com/todos/


    //useing async await
    app.get('/event', async (req, res) => {
        console.log("THIS IS THE EVENT ROUTE IN THE SEVER");

        //lorem
        // const groceryResult = await fetch("https://jsonplaceholder.typicode.com/todos/") //later on put grocery api here
        // let groceryJson = await groceryResult.json()
        //drinks
        const drinkResult = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a") //later on put grocery api here
        let drinkJson = await drinkResult.json()
        //food
        const foodResult = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a") //later on put grocery api here
        let foodJson = await foodResult.json()
        // bat man movie
        const movieResult = await fetch("https://fake-movie-database-api.herokuapp.com/api?s=batman") //later on put grocery api here
        let movieJson = await movieResult.json()
        //star wars movie
        const movieTwoResult = await fetch("https://fake-movie-database-api.herokuapp.com/api?s=star%20wars") //later on put grocery api here
        let movieTwoJson = await movieTwoResult.json()

        //slice returns new array , splice mutates it
        //console.log(groceryJson.length);
        console.log("this is foodJson.meals length ", foodJson.meals.length);
        // console.log("this is drinkJson length ", drinkJson.size);
        // console.log("this is groceryJson length ", groceryJson.size);
        console.log("this is movieJson.Search length ", movieJson.Search.length);
        console.log("this is movieJson.Search  ", movieJson.Search);
        console.log("this is movieTwoJson.Search  ", movieTwoJson.Search);
        foodJson = foodJson.meals.slice(0, 3)
        // groceryJson = groceryJson.slice(0, 10)
        drinkJson = drinkJson.drinks.slice(0, 3)
        movieJson = movieJson.Search
        movieTwoJson = movieTwoJson.Search
        //console.log(groceryJson.length);
        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('event.ejs', { drink: drinkJson, food: foodJson, movie: movieJson, movieTwo: movieTwoJson })
    })

    //_______________________adding event logic start_______________________

    //need a route to grab drinks
    //need a route to grab meal
    //need a route to grab movie

    //need route that sends all inputted for data to database

    //need route to load page to display event details
    app.get('/event_details', async (req, res) => {

        const eventResult = await db.collection('events').find().toArray()
        res.render('event_details.ejs', { event: eventResult })
    })
    //need route to delete event

    //if time permits make route to update already existing events


    //_____________________________________________
    //Working with object id


    // app.get('/viewCluster/:clusterId', async (req, res) => {
    //     console.log(req.params.clusterId);
    //     console.log("This is req.params._id: ", req.params._id);

    //     const infoClusterItemsResult = await db.collection('info_cluster_item').find({
    //         cluster_id: ObjectID(req.params.clusterId)
    //     }).toArray()
    //     console.log(infoClusterItemsResult);

    //     res.render('viewCluster.ejs', { infoClusterItems: infoClusterItemsResult })
    // })


    //_____________________________________________

    //_______________________adding event logic end_______________________


    //update
    app.put('/messages', (req, res) => {
        db.collection('todolist')
            .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
                $set: {
                    thumbUp: req.body.thumbUp + 1
                }
            }, {
                    sort: { _id: -1 },
                    upsert: true
                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })
    })

    //create

    app.post('/addEvent', (req, res) => {

        console.log(req.body);

        db.collection('events').insertOne({

            //send all the details of the event to the database
            date: req.body.date,
            personOne: req.body.personOne.trim(),
            personTwo: req.body.personTwo.trim(),
            personThree: req.body.personThree.trim(),
            batmovie: req.body.batmovie,
            starmovie: req.body.starmovie,
            eventTitle: req.body.eventTitle.trim(),
            drink: req.body.eventDrink,
            meal: req.body.eventMeal,

        }, (err, result) => {
            if (err) return console.log(err)
            console.log('event added to database!')
            //res.render('event_details.ejs', { cart: result })
        })
    })

    //view event

    app.get('/viewEvent/:_id', async (req, res) => {
        //console.log(req.params.clusterId);
        console.log("This is req.params._id: ", req.params._id);

        const eventResult = await db.collection('events').find({
            _id: ObjectID(req.params._id)
        }).toArray()
        console.log("This is event result ", eventResult);

        res.render('view_event.ejs', { singleEvent: eventResult })
    })

    //update event
    app.put('/updateEvent', (req, res) => {
        console.log("THIS IS UPDATE ON THE SERVER SIDE", req.body);

        db.collection('events')
            .findOneAndUpdate({
                _id: ObjectID(req.body._id)
            }, {
                    $set: {
                        // update the name of the event
                        favorited: req.body.favorited
                    }
                }, {
                    sort: { _id: -1 },

                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })

    })

    //delete event
    app.delete('/removeEvent', (req, res) => {
        console.log(req.body);

        db.collection('events').findOneAndDelete({ _id: ObjectID(req.body._id) }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Event deleted!')
        })
    })

    //___________________________________________________________________________
    // app.post('/todotask', (req, res) => {
    //     db.collection('todolist').insertOne({ task: req.body.task, priority: req.body.priority, completed: false }, (err, result) => {
    //         if (err) return console.log(err)
    //         console.log('saved to database')
    //         res.redirect('/')
    //     })
    // })


    //change value of check
    app.put('/completetask', (req, res) => {
        db.collection('todolist')
            .findOneAndUpdate({ task: req.body.task }, {
                $set: {
                    // thumbUp: req.body.thumbUp + 1
                    completed: true
                }
            }, {
                    sort: { _id: -1 },
                    upsert: true
                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })
    })

    //delete

    app.delete('/deletetask', (req, res) => {
        console.log(req.body);

        db.collection('todolist').findOneAndDelete({ task: req.body.task }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/event', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/event', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/event');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
