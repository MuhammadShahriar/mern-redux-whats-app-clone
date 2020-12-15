
// importing
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const userData = require('./dbUser.js');
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
    
    io.on('connection', (socket) => {
        console.log("New clint");

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

            console.log(message)
            socket.emit ( "recieveMessage", {
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
    

});

// app.get( '/user/sync', (req, res) => {
//     //count({/* criteria */}, { limit: 1 })
//     userData.find (( err, data ) => {
//         if ( err ) {
//             res.status(500).send(err);
//         }
//         else {
//             res.status(200).send(data);
//         }
//     } );
// } );

// app.get('/user/sync', async function(req, res) {

//     // Access the provided 'page' and 'limt' query parameters
//     //const email = req.query.email;
//     //let limit = req.query.limit;

//     //const Count = await userData.findAll().paginate({page: page, limit: limit}).exec();
//     userDB = db.collection("userdatas");
    
//     const Count = await userDB.count({"email": "String"}, { limit: 1 })

//     // Return the articles to the rendering engine
    
//     res.status(200).send(Count);
// });

// db.collection.update(
//     { _id: ObjectId("557914833ac61e518e6103ab") }, //update doc with this id
//     { $set:
//        {
//          "dataValue.default": [
//           "default A", 
//           "default B" 
//           ]
//        }
//     }
//  )

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

// app.post ( "userdata/update", cors(corsOptions), (req, res, next) => {
//     const dbData = req.body

//     userData.create(dbData, (err, data)=>{
//         if (err) {
//             res.status(500).send(err);
//         }
//         else{
//             res.status(201).send(data);
//         }
//     });
// } );




// listen
server.listen(port, () => {
    console.log(`{listening on :${port}}`);
});