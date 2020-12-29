
// importing
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const userData = require('./dbUser.js');
const firendShipData = require ( './dbFriendShip.js' );
const cors = require('cors');

// app config
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server,{
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });


const port = process.env.PORT || 9000;

app.use( (req, res, next) => {
    res.setHeader ("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader ("Access-Control-Allow-Headers", "http://localhost:3000");
    //res.setHeader ( "Access-Control-Allow-Methods", ["POST", "GET"] );
    next();
} );

app.get ( "/", (req, res) => res.status(200).send('Alhamdulillah') );

io.on("connection", (socket) => {
    console.log("New client connected");
});



//midleware
app.use(express.json());

//DB config
//pass : lbx6b37qGOdPZuSf
// db name : whatsappdb
const connection_url = "mongodb://admin:lbx6b37qGOdPZuSf@cluster0-shard-00-00.kwttn.mongodb.net:27017,cluster0-shard-00-01.kwttn.mongodb.net:27017,cluster0-shard-00-02.kwttn.mongodb.net:27017/whatsappdb?ssl=true&replicaSet=atlas-dagqnh-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect( connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
} );


const db = mongoose.connection;

db.once('open', ()=>{
    const chatList = db.collection("messagecontents");
    const userDB = db.collection("userdatas");
    const friendShipDB = db.collection("friendshipdatas");
    
    io.on('connection', (socket) => {
        const id = socket.handshake.query.id
        socket.join(id)

        socket.on('sendMessage', ({message, sender, receiver, timestamp, status}) => {
            chatList.insertOne(
                {
                  "message": message,
                  "sender": sender,
                  "receiver": receiver,
                  "timestamp": timestamp,
                  "status": status
                }
             );
             console.log(id, receiver, sender);

             socket.broadcast.to(receiver).emit ( "recieveMessage", {
                message: message,
                sender: sender,
                receiver: receiver,
                timestamp: timestamp,
                status: status
            } );
        });
    });

    app.get('/user/sync', async (req, res) => {

        const email = req.query.email;
        console.log(email)
        
        const Count = await userDB.countDocuments({"email": email}, { limit: 1 }).catch((err) => {
            res.json(500, err);
            return;
        })
        
        res.json(200, {count: Count});
    });

    app.post ( "/user/logout", async (req, res) => {
        const email = req.query.email;
        userDB.updateOne(
            { email: email }, 
            { $set:
                {
                    "singedIn" : false
                }
            }
        )
    } );
    
    app.post ( "/user/login", async (req, res) => {
        const email = req.query.email;
        console.log(email);
        userDB.updateOne(
            { email: email }, 
            { $set:
                {
                    "singedIn" : true
                }
            }
        )
    } );

    
    app.get('/user/search', async (req, res) => {

        const email = req.query.email;
        console.log(email);
        
        await userDB.find({"email" : email },{  projection: { _id: 0, name: 1, email : 1 } } ).toArray((err, data) => {
            if ( err ) {
                res.json(500, err);
                return;
            }
            console.log(data);
            res.json(200, data);
        });
    });

    app.get('/friendship/search', async (req, res) => {

        const user = req.query.user;
        const friend = req.query.friend;
        console.log(user, friend);
        
        
        const Count = await friendShipDB.countDocuments( {"user": user, "friend" : friend }, { limit: 1 }).catch((err) => {
            res.json(500, err);
            return;
        });
        
        console.log(Count)
        res.json(200, {count: Count});
    });

    
    app.get('/friendList/sync', async (req, res) => {

        const user = req.query.user;
        console.log(user);
        
        await friendShipDB.find({"user" : user },{  projection: { _id: 0, friend: 1, timestamp: 1 } } ).toArray((err, data) => {
            if ( err ) {
                res.json(500, err);
                return;
            }
            res.json(200, data);
        });
    });
    
    
    app.get('/chat/sync', async (req, res) => {

        const user = req.query.user;
        const friend = req.query.friend;
        //console.log(user, friend);
        
        await chatList.find(
            {$or:[{"sender" : user, "receiver" : friend}, {"sender" : friend, "receiver" : user}]} ).toArray((err, data) => {
                if ( err ) {
                    res.json(500, err);
                    return;
                }
                //console.log(data);
                res.json(200, data);
            });
    });

});


const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors());

app.post ( '/user/new', cors(corsOptions), (req, res, next) => {
    const dbData = req.body

    userData.create(dbData, (err, data)=>{
        if (err) {
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    });
} );





app.get ( '/friendship/new', cors(corsOptions), (req, res, next) => {
    const dbData = req.body

    firendShipData.create(dbData, (err, data)=>{
        if (err) {
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    });
} );






// listen
server.listen(port, () => {
    console.log(`{listening on :${port}}`);
});