import express from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import bcrypt from "bcrypt";
import {createUserSchema,signinSchema,createRoomSchema} from "@repo/common/zod";
import {prismaClient} from "@repo/db/data"
import { auth } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));
const port = 3000;


const saltRounds = 10;
app.post("/signup", async (req,res) =>{
    const result = createUserSchema.safeParse(req.body);
    if(!result.success){
        res.status(401).json({
            message : "Incorrect Inputs"
        })
        return;
    }
    const {username,password,name,photo} = result.data;
    const matched_user = await prismaClient.user.findUnique({
        where : {
            username : username 
        }
    });
    if(matched_user){
        return res.status(401).json({
            message : "User already exists"
        })
    }
    const hashed_pass = await bcrypt.hash(password,saltRounds);
    const user = await prismaClient.user.create({
        data : {
            username,
            password : hashed_pass,
            name,
            photo
        }
    })
    return res.status(200).json({
        message : "Sign in succeded",
        userId : user.id
    })
})

app.post("/signin", async (req,res)=>{

    const result = signinSchema.safeParse(req.body);
    if(!result.success){
        res.status(401).json({
            message : "Incorrect Credentials"
        })
        return;
    }
    const {username,password} = result.data;

    const matched_user = await prismaClient.user.findUnique({
        where : {
            username : username
        }
    });
    if(!matched_user){
        return res.status(401).json({
            message : "Sign up first"
        })
    }
    const token = await jwt.sign({
        userId : matched_user.id,
    },JWT_SECRET);
    const pass_match = await bcrypt.compare(password,matched_user.password);
    if(!pass_match){
        res.status(401).json({
            message : "Password donot matched"
        })
        return;
    }
    return res.status(200).json({
        message : "sign up succeded",
        token
    })
})

app.post("/room",auth, async (req,res)=>{
    const result = createRoomSchema.safeParse(req.body);
    if(!result.success){
        res.status(401).json({
            message : "Incorrect Inputs"
        })
        return;
    }

    const {slug} = result.data;
    //@ts-ignore
    const userId = req.userId;

    const room = await prismaClient.room.create({
        data : {
            slug,
            adminId : userId
        }
    })
    res.status(200).json({
        roomId : room.id
    })
})

app.get("/chats/:roomId", async (req,res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
        orderBy : {
            id : "desc"
        },
        take : 50
    })
    res.json({
        messages
    })
})

app.get("/room/:slug", async (req,res)=>{
    const slug = req.params.slug;
    const rooms = await prismaClient.room.findFirst({
        where : {
            slug : slug
        }
    })
    res.json({
        rooms
    })
})

app.listen(port, ()=>{
    console.log(`app is running at port ${port}`);
})