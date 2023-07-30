const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const passport2 =require("passport")
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require("dotenv").config();
const {Pool,Client}= require('pg')
const multer = require("multer"); // Add multer for file upload
const path = require("path"); // Add path for file upload


const connectionString='postgressql://postgres:admin@localhost:5432/attendance'
const PORT = process.env.PORT || 5000;
const app = express();
const initializePassport = require("./passportConfig");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage: storage });
// initializePassport(passport);
// try {
//   client.connect();
//   console.log("connected to database");
// } catch (err) {
//   console.log("cannot connect to database");
//   console.log(err);
// }

// Middleware

// Parses details from a form
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// // Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
require('./passportConfig')(passport);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated,(req, res) => {
  res.render("register.ejs");
});

app.get("/users/AddCourse", checkAuthenticated,(req, res) => {
  res.render("AddCourse.ejs");
});

app.get("/users/login", checkAuthenticated,(req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error);
  res.render("login.ejs");
});


//login2 
app.get("/users/login2", checkAuthenticated2,(req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error);
  res.render("login2.ejs");
});


app.all("/users/dashboard",checkAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  console.log("dashboard1")
  res.render("dashboard", { user: req.user.name });
});

//dashboard2
app.all("/users/dashboard2",checkAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  console.log("dashboard2")
  res.render("dashboard2", { user: req.user.name });
});

//dashboard2
// app.all("/users/dashboard2",checkAuthenticated, (req, res) => {
//   // console.log(req.isAuthenticated());
//   res.render("dashboard2", { user: req.user.name });
// });


app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});

app.get("/users/query1", (req, res) => {
    res.render("query1", { message: "Yess" });
  });

app.get("/users/query2", (req, res) => {
    res.render("query2", { message: "Yesss" });
});

app.get('/dropdown-data', (req, res) => {
  const client= new Client({
    connectionString:connectionString
  })
  client.connect()
  client.query('SELECT name FROM faculty', (error, results) => {
    if (error) {
      console.error('Error fetching data from PostgreSQL', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results.rows);
    }
  });
});


app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } 
    else {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      // Validation passed
    const client= new Client({
      connectionString:connectionString
    })
    client.connect()
    client.query('INSERT INTO faculty(name,email,password) VALUES ($1, $2, $3)', [name,email,hashedPassword], (err,res)=> {
        console.log(err,res);
        client.end() 
        //alert("Data Saved");
        
  
    })
    async function sendEmails() {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: '202001223@daiict.ac.in',
            pass: process.env.PASS,
          },
        });
        const mailOptions = {
            from: '202001223@daiict.ac.in',
            to: email,
            subject: 'Credentials from Node.js',
            text: `Hello,
            These are your username and password to accsess Attendance management portal of daiict
            Username: ${name}\nPassword: ${password}`,
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(`Failed to send email to ${email}:`, error);
            } else {
              console.log(`Email sent to ${email}:`, info.response);
            }
          });
        }
        sendEmails()
        .then(() => console.log('Emails sent successfully.'))
        .catch(error => console.error('Error sending emails:', error));
    res.redirect("/users/register");
  }
});


app.post("/users/AddCourse", async (req, res) => {
  let { CourseName,CourseID, faculty1, faculty2 } = req.body;
  console.log(req.body);
  let errors = [];


  if (!CourseName|| !CourseID|| !faculty1) {
    errors.push({ message: "Please enter all fields" });
  }

 
  if (errors.length > 0) {
    res.render("AddCourse", { errors,CourseName,CourseID,faculty1,faculty2 });
  } 
    else {
      
    const client= new Client({
      connectionString:connectionString
    })
    client.connect()
    if(faculty2){
    client.query('INSERT INTO course(CourseName,CourseID,faculty1,faculty2) VALUES ($1, $2, $3, $4)', [CourseName,CourseID,faculty1,faculty2], (err,res)=> {
        console.log(err,res);
        client.end() 
        //alert("Data Saved");}
        
  
    })
    }
    else{
      client.query('INSERT INTO course(CourseName,CourseID,faculty1) VALUES ($1, $2, $3)', [CourseName,CourseID,faculty1], (err,res)=> {
        console.log(err,res);
        client.end() 
        //alert("Data Saved");}
        
  
    })
    }
    res.redirect("/users/dashboard");
  }
});


// app.post(
//   "/users/login",(req, res) => {
//     res.redirect("/users/dashboard");
// });

app.post("/users/login2", passport.authenticate("login2", {
  successRedirect: "/users/dashboard2",
  failureRedirect: "/users/login2",
}));

app.post("/users/login", passport.authenticate("login1", {
  successRedirect: "/users/dashboard",
  failureRedirect: "/users/login",
}));
// app.post(
//   "/users/login",
//   passport.authenticate("local-login1", {

//     successRedirect: "/users/dashboard",
//     failureRedirect: "/users/login",
//     failureFlash: true
//   })
// );

//  //login 2
// app.post(
//   "/users/login2",
//   passport.authenticate("local-login2", {
//     successRedirect: "/users/dashboard2",
//     failureRedirect: "/users/login2",
//     failureFlash: true
//   })
// );


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("in check")
    // return res.redirect("/users/dashboard");
  }
  next();
}


function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

function checkAuthenticated2(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("in check")
    // return res.redirect("/users/dashboard");
  }
  next();
}

// Add this code for file upload
const fs = require('fs');

// File upload route
// Add the required modules
const xlsx = require('xlsx');

// ...

// File upload route
app.post("/upload", checkAuthenticated, upload.single("uploadFile"), async (req, res) => {
  if (req.file) {
    // File has been uploaded successfully
    const uploadedFileName = req.file.filename;
    
    try {
      const client = new Client({
        connectionString: connectionString
      });
      await client.connect();

      // Read data from the Excel file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet in the Excel file
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // Perform database operations with the data from the Excel file
      for (const row of data) {
        const {studentid,studentname,semester,academicyear,coursename,coursecode,date,month,year/* add more columns based on your Excel structure */ } = row;

        // Modify the insertion query accordingly with the appropriate columns in the attendance table
        const queryText = 'INSERT INTO attendance ( studentid,studentname,semester,academicyear,coursename,coursecode,date,month,year) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)';
        const values = [studentid,studentname,semester,academicyear,coursename,coursecode,date,month,year];
        await client.query(queryText, values);
      }

      await client.end();

      res.render("dashboard", { user: req.user.name, message: `File ${uploadedFileName} has been uploaded and data inserted successfully.` });
    } catch (err) {
      console.error("Error while uploading file and saving to the database:", err);
      res.render("dashboard", { user: req.user.name, message: "An error occurred while processing the file upload. Please try again." });
    } finally {
      // Remove the uploaded file from the server's temporary storage
      fs.unlinkSync(req.file.path);
    }
  } else {
    // No file uploaded
    res.render("dashboard", { user: req.user.name, message: "Please select a file to upload." });
  }
});

// ... (existing code)

app.get("/attendance/filter", checkAuthenticated, async (req, res) => {
    try {
      const { date, month, year, courseName } = req.query;
  
      // Perform the database query to get the filtered data
      const client = new Client({
        connectionString: connectionString
      });
      await client.connect();
  
      // Modify the query to match your database schema
      const queryText = 'SELECT * FROM attendance WHERE date = $1 AND month = $2 AND year = $3 AND coursename = $4';
      const values = [date, month, year, courseName];
      const result = await client.query(queryText, values);
  
      await client.end();
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      res.status(500).json({ message: "An error occurred while fetching the filtered data." });
    }
  });

  app.get("/attendance/filter1", checkAuthenticated, async (req, res) => {
    try {
      const { studentid, courseName } = req.query;
  
      // Perform the database query to get the filtered data
      const client = new Client({
        connectionString: connectionString
      });
      await client.connect();
  
      // Modify the query to match your database schema
      const queryText = 'SELECT COUNT(*) FROM attendance WHERE studentid = $1 AND courseName = $2';
      const values = [studentid,courseName];
      const result = await client.query(queryText, values);
  
      await client.end();
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      res.status(500).json({ message: "An error occurred while fetching the filtered data." });
    }
  });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// module.exports = {client};