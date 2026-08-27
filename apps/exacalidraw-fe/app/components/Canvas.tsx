import { useEffect,useRef } from "react";
import { initDraw } from "../draw";
import { WS_URL } from "@/config";

export function Canvas({roomId,socket} : {
    roomId : string ,
    socket : WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
     useEffect(()=>{
            if(canvasRef.current){
                const canvas = canvasRef.current;
               if(canvas){
               initDraw(canvas,roomId,socket);
               }
            }
        },[roomId,socket])

        return <div>
             <canvas ref = {canvasRef} width = {2000} height = {2000}  ></canvas>
        </div>
}