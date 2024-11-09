var express = require("express");
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;

var conString = "mongodb://127.0.0.1:27017";
var app = express();
app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post("/register-user", (req, res)=>{

    var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email:req.body.Email,
        Mobile: req.body.Mobile
    };

    mongoClient.connect(conString).then(clientObject=>{
         var database = clientObject.db("to-do");
         database.collection("users").insertOne(user).then(()=>{
             console.log("User Added");
             res.end();
         });
    });

});

app.post("/add-task", (req, res)=>{

    var task = {
        AppointmentId: parseInt(req.body.AppointmentId),
        Title: req.body.Title,
        Description: req.body.Description,
        Date: new Date(req.body.Date),
        UserId: req.body.UserId
    };

    mongoClient.connect(conString).then(clientObject=>{
         var database = clientObject.db("to-do");
         database.collection("appointments").insertOne(task).then(()=>{
             console.log("Task Added");
             res.end();
         });
    });

});

app.put('/update-task/:id', (req, res)=>{
     var id = parseInt(req.params.id);

     var task = {
        AppointmentId: parseInt(req.body.AppointmentId),
        Title: req.body.Title,
        Description: req.body.Description,
        Date: new Date(req.body.Date),
        UserId: req.body.UserId
    };

     mongoClient.connect(conString).then(clientObject=>{

         var database = clientObject.db("to-do");

         database.collection("appointments").updateOne({AppointmentId:id},{$set:task}).then(()=>{
             console.log("Task Updated");
             res.end();
         });
         
     });


});

app.delete('/delete-task/:id', (req, res)=>{
    var id = parseInt(req.params.id);

 

    mongoClient.connect(conString).then(clientObject=>{

        var database = clientObject.db("to-do");

        database.collection("appointments").deleteOne({AppointmentId:id}).then(()=>{
            console.log('Task deleted..');
            res.end();
        })
       
    });


});



app.get('/get-users', (req, res)=>{

    mongoClient.connect(conString).then(clientObject=>{

        var database = clientObject.db("to-do");

        database.collection("users").find({}).toArray().then(documents=>{

            res.send(documents);
            res.end();

        });

    });

});



app.get('/get-task/:userid', (req, res)=>{


    mongoClient.connect(conString).then(clientObject=>{

        var database = clientObject.db("to-do");

        database.collection("appointments").find({UserId:req.params.userid}).toArray().then(documents=>{

            res.send(documents);
            res.end();

        });

    });

});

app.listen(6600);
console.log(`Server Started : http://127.0.0.1:6600`);