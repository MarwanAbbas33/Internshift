const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");


const corsOptions = {
    origin:'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
 }



app.use(cors(corsOptions));


//Import Routes

const authRoute = require("./controllers/auth");
const postRoute = require("./controllers/post");
const applicationRoute = require("./controllers/application");
const supervisorRoute = require("./controllers/supervisor");
const studentRoute = require("./controllers/student");
const companyRoute = require("./controllers/company")



//Middlewares

app.use(express.json());
app.use(cors(corsOptions));


//Routes Middlewares

app.use('/auth',authRoute);
app.use('/post',postRoute);
app.use('/application', applicationRoute);
app.use('/supervisor', supervisorRoute);
app.use('/student', studentRoute);
app.use('/company', companyRoute);



app.listen(3000, () => {
  console.log("app is running");
  mongoose.connect(
    "mongodb+srv://AbuEl3abbas:BsZUSKpVH8hZBnHK@cluster0.nhp9l.mongodb.net/test?retryWrites=true&w=majority",
    () => console.log("connected to db")
  );
});
