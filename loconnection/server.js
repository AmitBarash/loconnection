const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('view engine' , 'ejs');

MongoClient.connect('mongodb+srv://loconnection:startupisteam4@users-cluster.00msnkt.mongodb.net/?retryWrites=true&w=majority' , { useUnifiedTopology: true })
.then(client => {
    console.log('connected to database');
    const loconnectionDB = client.db('loconnectionDB')
    const usersCollection = loconnectionDB.collection('usersCollenction')

    app.get('/' , (req , res) => {
        res.render('start' , {isExists: true , isInUse: false});
    });
    app.get('/footer' , (req , res) => {
        res.render('footer');
    })

    app.post('/already-exists' , (req , res) => { 
            usersCollection.find().toArray()
            .then(result => {
            let ans = -1;
            for(let i = 0 ; i < result.length ; i++)
            {
                if(result[i].userName == req.body.userName)
                {
                    ans = i;
                }
            }
            if(ans == -1) //means that the username is not already in use
            {
                usersCollection.insertOne(req.body);
                res.render('start' , {isExists: true , isInUse: false});
            }
            else //ans equals to -1 and isValid is true (means that the username is invalid or already in use)
            {
                res.render('start' , {isExists: true , isInUse: true});
                console.log('this username is already in use');
            }
        })
        .catch(error => console.error(error))
    });
    app.get('/details' , (req , res) => {
        res.render('signUpDetails');
    });
    app.post('/not-found' , (req , res) => {  //when after log in password or username havn't found
        usersCollection.find().toArray()
        .then(results => {
            let ans = -1;
            for(let i = 0 ; i < results.length ; i++)
            {
                if(isInArr(results , req.body) == true)
                {
                    ans = i;
                }
            }
            if(ans != -1) //user exists
            {
                res.render('homePage');
                console.log('the user does exist');
            }
            else //equals to -1 (user doesn't exists)
            {
                res.render('start' , {isExists: false , isInUse: false});
                console.log('the user does not exist');
            }
        })
        .catch(error => console.error(error))
    })
    
    function isInArr(arr , user)
    {
        for(let i = 0 ; i < arr.length ; i++)
        {
            if((user.userNameLog) == (arr[i].userName) && (user.passwordLog) == (arr[i].password))
                return true;
        }
        return false;
    }
    // app.use( function(req, res) {
    //     console.log('error');
    // });
    app.listen(3000 , () => {
        console.log('server is listening on port 3000');
    });
})




// app.get('/' , (req , res) => {
//     res.status(200).render('start');
// });
// app.post('/ans' , (req , res) => {
//     const userName = req.body.username;
//     console.log(userName);
//     res.status(200).render('ans' , {userName});
// });
// app.get('/login' , (req , res) => {
//     res.status(200).render('login');
// });

