import mongoose from "mongoose";
import { type } from "os";
const User = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    is_manager:{
        type:Boolean,
        required:true
    }
},{timestamps:true});