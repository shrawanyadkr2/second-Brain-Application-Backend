"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    // time milega tb zod krenge
    try {
        const username = req.body.username;
        const password = req.body.password;
        await db_1.UserModel.create({
            username: username,
            password: password,
        });
        res.json({
            msg: "you are signed up",
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "User is already exst"
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await db_1.UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            msg: "incorrect credential"
        });
    }
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await db_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        msg: "content is added"
    });
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId");
    res.json({
        content
    });
});
app.delete("/api/v1/delete", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await db_1.ContentModel.deleteOne({
        _id: contentId, // use _id instead of contentId
        //@ts-ignore
        userId: req.userId // correct syntax
    });
    res.json({
        msg: "content deleted"
    });
});
app.post("/api/v1/brain/share", (req, res) => { });
app.get("/api/v1/brain/:shareLink", (req, res) => { });
app.listen(3000);
//# sourceMappingURL=index.js.map