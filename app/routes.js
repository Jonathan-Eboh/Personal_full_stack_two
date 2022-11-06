const fetch = require("node-fetch")

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
        const groceryResult = await fetch("https://jsonplaceholder.typicode.com/todos/") //later on put grocery api here
        let groceryJson = await groceryResult.json()

        const drinkResult = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a") //later on put grocery api here
        let drinkJson = await drinkResult.json()

        //slice returns new array , splice mutates it
        console.log(groceryJson.length);

        groceryJson = groceryJson.slice(0, 10)
        drinkJson = drinkJson.drinks.slice(0, 3)
        console.log(groceryJson.length);
        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('event.ejs', { event: groceryJson, drink: drinkJson })
    })

    //_______________________adding event logic start_______________________

    //need a route to grab drinks
    //need a route to grab meal
    //need a route to grab movie

    //need route that sends all inputted for data to database

    //need route to load page to display event details

    //need route to delete event

    //if time permits make route to update already existing events




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
    app.post('/todotask', (req, res) => {
        db.collection('todolist').insertOne({ task: req.body.task, priority: req.body.priority, completed: false }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/')
        })
    })


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
