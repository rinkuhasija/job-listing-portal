const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require("./model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require('./middleware/auth');
const Job = require('./model/jobModel')
const validateJobPost = require('./middleware/validateJobPost');
const app = express();

//connect to DB
connectDB();


//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
  try {
    res.status(200).send("Hello World");
  } catch (err) {
    res.status(500).send('Server Error', err);
  }
});

app.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    //validate input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });


    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.save();

    res.status(201).json(user);

  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    //validate input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // check if user exist in our database
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      res.status(200).json(token);

    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
})

app.post("/addJob", auth, validateJobPost, async (req, res) => {

  try {
    const { company_name, logo_url, job_position, salary, job_type, location, job_description, about_company, skills_req } = req.body;

    //validate input
    if (!(company_name && logo_url && job_position && salary && job_type && location && job_description && about_company && skills_req)) {
      res.status(400).send("All input is required");
    }

    // Create job in our database
    const job = new Job({
      company_name,
      logo_url,
      job_position,
      salary,
      job_type,
      location,
      job_description,
      about_company,
      skills_req,
    });

    job.save()

    res.status(201).send("JOB POSTED SUCCESSFULLY");

  } catch (err) {
    console.log(err);
  }
})

//list all jobs
app.get("/allJobs", async (req, res) => {

  try {
    const jobs = await Job.find({});

    res.status(200).json(jobs);

  }
  catch (err) {
    console.log((err));
  }
})

//filter jobs based on skills
app.get('/jobs/:skill', async function (req, res) {
  try {
    const skill = req.params.skill;
    const jobs = await Job.find({ skills_req: { $in: ["css", "react"] } });
    res.json(jobs);

  } catch (err) {
    console.log(err);
  }

});

app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
