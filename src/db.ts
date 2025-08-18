import mongoose, { model,Schema } from "mongoose";
mongoose.connect("mongodb+srv://admin:ftc5w1ttoyEOAWDV@cluster0.uyjza.mongodb.net/second-brain");

const userSchema= new Schema({
    username : {type : String , unique:true },
    password : String
})

export const UserModel =  model("user",userSchema) ;

const contentSchema = new Schema({
    title : String ,
    link : String,
    tags : [{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId : {type:mongoose.Types.ObjectId, ref:'user', required:true}

})

export const ContentModel = model("content", contentSchema);
