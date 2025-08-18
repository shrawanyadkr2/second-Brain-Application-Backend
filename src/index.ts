import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import express from "express";
import { ContentModel, UserModel } from "./db";

import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";


const app = express();

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  // time milega tb zod krenge
  try {
    const username = req.body.username;
    const password = req.body.password;

    await UserModel.create({
      username: username,
      password: password,
    });

    res.json({
      msg: "you are signed up",
    });
  } catch (e) {
    res.status(411).json({
        msg:"User is already exst"
    })
  }
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            msg : "incorrect credential"
        })
    }

});

app.post("/api/v1/content", userMiddleware,async (req, res) => {
    const link=req.body.link;
    const type=req.body.type;

    await ContentModel.create({
        link,
        type,
        title:req.body.title,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })

    res.json({
        msg:"content is added"
    })
});

app.get("/api/v1/content", userMiddleware,async (req, res) => {
    //@ts-ignore
    const userId=req.userId;
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId");

    res.json({
        content
    })

});

app.delete("/api/v1/delete", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteOne({
    _id: contentId,              // use _id instead of contentId
    //@ts-ignore
    userId: req.userId           // correct syntax
  });

  res.json({
    msg: "content deleted"
  });
});


app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(3000);
