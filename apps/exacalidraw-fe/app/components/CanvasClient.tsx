"use client"

import { useEffect,useRef, useState } from "react";
import { initDraw } from "../draw";
import { WS_URL } from "@/config";


export function Canvas({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [socket,setSocket] = useState(null);

    useEffect(()=>{
        const ws = new WebSocket(WS_URL)
    },[])
        useEffect(()=>{
            if(canvasRef.current){
                const canvas = canvasRef.current;
               if(canvas){
               initDraw(canvas,roomId);
               }
            }
        },[canvasRef])
        return <div>
            <canvas ref = {canvasRef} width = {2000} height = {2000}  ></canvas>
            
        </div>
}