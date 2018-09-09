//server.js
//base setup

//call the packages we need

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Bear = require('./app/models/bear');

mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database

//configure app touse bodyParser()
//this will let us get the data from a POST

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //set port

//ROUTES FOR OUR API
var router = express.Router();

router.use((req,res,next)=>{
    //do logging
    console.log('algo esta pasando (next)');
    next(); //make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at get http://localhost:8080)
router.get('/', (req,res) => {
    res.json({message:'bienvenido a mi primer REST API'});
});

router.route('/bears')
    .post((req,res)=>{
        var bear = new Bear();
        bear.name = req.body.name;

        //save the bear and check for errors
        bear.save((err)=>{
            if(err)
                res.send(err);
                
            res.json({message: 'Bear created!'});
        });
    });

router.route('/bears/:bear_id')
    //get the bear wirth that id (acceced at GET http://localhost:8080/api/bears/:bear_id)
    .get((req,res)=>{
        Bear.findById(req.params.bear_id, 
            (err,bear)=>{
                if(err)
                    res.send(err);

                res.json(bear);
            });
    })
    .put((req,res)=>{
        //use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, 
            (err,bear)=>{
                if(err)
                    res.send(err);
                //update the bears info
                bear.name = req.body.name;
                
                bear.save((err)=>{
                    if(err)
                        res.send(err);

                    res.json({message:'Bear updated!'})
                });
            });
    })
    .delete((req,res)=>{
        Bear.remove({_id: req.params.bear_id},
            (err,bear)=>{
            if(err)
                res.send(err)

            res.json({message: 'Successfully deleted!'});
        })
    });
//register our routes
//al of our routes will be prefixed with /api
app.use('/api', router);

//start the server
app.listen(port);
console.log('magic happens on port ' + port);

