const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company_name: { type: String , required: true },
    logo_url: { type: String, required: true  },
    job_position: {
        type: String,
        required: true,
    },
    salary: { type: String, required: true },
    job_type: { type: String, required: true },
    location : { type : String, required: true } ,
    job_description : { type: String},
    about_company : {type: String},
    skills_req : {type: String}
});

module.exports = mongoose.model("job", jobSchema);