const mongoose = require("mongoose");
const TimesheetSchema = new mongoose.Schema({
    project_id:{
        type:mongoose.Types.ObjectId,
        ref:"Project"
    },
    manager_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    employee_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    start_time:{
        type:Date,
        required:true
    },
    end_time:{
        type:Date,
        required:true
    },
    description:{
        type:String
    }
}, { timestamps: true });
module.exports = mongoose.model("Timesheet",TimesheetSchema);