"use client"
import { useEffect,useRef, useState } from "react";
import { initDraw } from "../draw";
import { WS_URL } from "@/config";
import { IconButton } from "./IconButon";
import { Circle, Eraser, Pencil, RectangleHorizontal, RectangleHorizontalIcon } from "lucide-react";

type Shape = "circle" | "rect" | "pencil" | "eraser";
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
        const [selectedTool,setSelectedTool] = useState<Shape>("circle")

        useEffect(()=>{
            //@ts-ignore
            window.selectedTool = selectedTool;
        },[selectedTool])

        return <div>
             <canvas ref = {canvasRef} width = {window.innerWidth} height = {window.innerHeight}  ></canvas>
             <TopBar selectedTool = {selectedTool} setSelectedTool={setSelectedTool}/>
        </div>
}

function TopBar({selectedTool, setSelectedTool} : {
    selectedTool : Shape,
    setSelectedTool : (s:Shape)=>void
}){
    
    return <div style = {{
                position : "fixed",
                top : 10,
                left : 10
             }}>
                <div className = "flex gap-4">
                    <IconButton activated = {selectedTool ==="pencil"} icon = {<Pencil/>} onClick = {()=>{
                        setSelectedTool("pencil")

                }}></IconButton>
                <IconButton activated = {selectedTool === "rect"} icon = {<RectangleHorizontalIcon/>} onClick = {()=>{
                    setSelectedTool("rect")
                }}></IconButton>
                <IconButton activated = {selectedTool === "circle"} icon = {<Circle/>} onClick = {()=>{
                    setSelectedTool("circle")
                    
                }}></IconButton>
               <IconButton activated = {selectedTool === "eraser"} icon = {<Eraser/>} onClick = {()=>{
                    setSelectedTool("eraser")
                    
                }}></IconButton>
                </div>
                
             </div>
}