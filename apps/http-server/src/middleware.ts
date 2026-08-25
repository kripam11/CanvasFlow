import {JWT_SECRET} from "@repo/backend-common/config";
import { NextFunction,Response,Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function auth(req : Request,res : Response,next : NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({
            message : "No token provided"
        });
        return;
    }
    const decodedInfo = jwt.verify(token,JWT_SECRET) as JwtPayload;
    if(decodedInfo.userId){
        //@ts-ignore
        req.userId = decodedInfo.userId;
        next();
    }
    else{
        return res.status(401).json({
            message : "Error occured"
        })
    }
}