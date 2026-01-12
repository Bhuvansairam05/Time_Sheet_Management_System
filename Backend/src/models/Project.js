const mongoose = require("mongoose");
const projectScheme = new mongoose.Schema({
    project_name:{
        type:String,
        required:true
    },
    manager_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String
    },
    start_date:{
        type:Date
    },
    end_date:{
        type:Date
    }
})
module.exports = mongoose.model("Project",projectScheme);