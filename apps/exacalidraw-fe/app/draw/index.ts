import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type : "rect",
    x : number,
    y : number,
    width : number,
    height : number
} | {
    type : "circle",
    centerX : number,
    centerY : number,
    radius : number
}

export async function initDraw(canvas : HTMLCanvasElement, roomId : string, socket : WebSocket){
  
    const ctx = canvas.getContext("2d");

            let existingShapes : Shape[] = await getExistingShapes(roomId);

            if(!ctx) return;

            socket.onmessage = (event)=>{
                const message = JSON.parse(event.data);

                if(message.type === "chat"){
                    const parsedShape = JSON.parse(message.message)
                    existingShapes.push(parsedShape)
                     clearCanvas(existingShapes,canvas,ctx)
                }
            }

         
            clearCanvas(existingShapes,canvas,ctx)
            let clicked = false;
            let startX = 0;
            let startY = 0;
            canvas.addEventListener("mousedown",(e)=>{
                clicked = true;
                startX = e.clientX
                startY = e.clientY
            })

           canvas.addEventListener("mouseup", (e) => {
    console.log("MOUSE UP");

    clicked = false;

    const width = e.clientX - startX;
    const height = e.clientY - startY;

    const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height
    };

    existingShapes.push(shape);

    console.log("Socket state:", socket.readyState);

    if (socket.readyState !== WebSocket.OPEN) {
        console.log("SOCKET IS NOT OPEN");
        return;
    }

    const data = {
        type: "chat",
        message: JSON.stringify(shape),
        roomId
    };

    console.log("SENDING:", data);

    socket.send(JSON.stringify(data));
});

            canvas.addEventListener("mousemove",(e)=>{
                if(clicked) {
                    const width = e.clientX - startX
                    const height = e.clientY - startY

                    clearCanvas(existingShapes,canvas,ctx);
                      ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, width,height);

       
                }
                
            })
   
}

function clearCanvas(existingShapes : Shape[], canvas : HTMLCanvasElement,ctx : CanvasRenderingContext2D){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle = "black";
     ctx.fillRect(0, 0, canvas.width, canvas.height);

     existingShapes.map((shape)=>{
        if(shape.type === 'rect'){
             ctx.strokeStyle = "white";
        ctx.strokeRect(shape.x, shape.y, shape.width,shape.height);
        }
     })


}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
        const res = await axios.get(
            `${HTTP_BACKEND}/chats/${roomId}`
        );

        console.log("FULL RESPONSE:", res);
        console.log("RESPONSE DATA:", res.data);

        const messages = res.data.msgs;

        console.log("MESSAGES:", messages);

        if (!Array.isArray(messages)) {
            console.log("Messages is not an array:", messages);
            return [];
        }

        const shapes = messages.map((x: { message: string }) => {
            return JSON.parse(x.message);
        });

        return shapes;

    } catch (error) {
        console.error("Error fetching existing shapes:", error);
        return [];
    }
}