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
} | {
    type : "pencil",
    points : {
        x : number,
        y : number
    }[]
} | {
    type : "eraser"
}

function eraseShape(
    x: number,
    y: number,
    existingShapes: Shape[]
) {
    for (let i = existingShapes.length - 1; i >= 0; i--) {

        const shape = existingShapes[i];

        if (shape.type === "rect") {
            if (
                x >= shape.x &&
                x <= shape.x + shape.width &&
                y >= shape.y &&
                y <= shape.y + shape.height
            ) {
                existingShapes.splice(i, 1);
                break;
            }
        }

        else if (shape.type === "circle") {
            const distance = Math.sqrt(
                (x - shape.centerX) ** 2 +
                (y - shape.centerY) ** 2
            );

            if (distance <= shape.radius) {
                existingShapes.splice(i, 1);
                break;
            }
        }

        else if (shape.type === "pencil") {
            for (const point of shape.points) {
                const distance = Math.sqrt(
                    (x - point.x) ** 2 +
                    (y - point.y) ** 2
                );

                if (distance < 10) {
                    existingShapes.splice(i, 1);
                    return;
                }
            }
        }
    }
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
            let points: { x: number, y: number }[] = [];
            canvas.addEventListener("mousedown",(e)=>{
                clicked = true;
                startX = e.clientX
                startY = e.clientY

                points = [
                    {
                        x : e.clientX,
                        y : e.clientY
                    }
                ];
            })

           canvas.addEventListener("mouseup", (e) => {
    console.log("MOUSE UP");

    clicked = false;

    const width = e.clientX - startX;
    const height = e.clientY - startY;

    let shape : Shape;
     // @ts-ignore
     const selectedTool = window.selectedTool;

     if(selectedTool === "rect"){
        shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        };
     }
     else if(selectedTool === "circle"){
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;

        const radius =
            Math.max(
                Math.abs(width),
                Math.abs(height)
            ) / 2;

        shape = {
            type: "circle",
            centerX,
            centerY,
            radius
        };
     } else if(selectedTool === "pencil"){
        shape = {
            type : "pencil",
            points : points
        };
     }
     else if(selectedTool === "eraser"){
    return;
     }
     else return;

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
                    //@ts-ignore
                    const selectedTool = window.selectedTool;
                    let shape : Shape
                    if(selectedTool === "rect"){
                        shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        };
                        ctx.strokeRect(startX, startY, width,height);
                    } else if(selectedTool === "circle"){

                        const centerX = startX + width/2;
                        const centerY = startY + height/2;
                        const radius = Math.max(Math.abs(width), Math.abs(height))/2
                         shape = {
            type: "circle",
            centerX,
            centerY,
            radius
        };
                        ctx.beginPath()
                        ctx.arc(centerX,centerY,radius,0,Math.PI *2)
                        ctx.stroke()
                    }
                    else if(selectedTool === "pencil"){
                        points.push({
                            x : e.clientX,
                            y : e.clientY
                        })

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y)

                        for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
                    }

                    else if(selectedTool === "eraser"){
                             eraseShape(
        e.clientX,
        e.clientY,
        existingShapes
    );

    clearCanvas(
        existingShapes,
        canvas,
        ctx
    );
                    }
       
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
        else if(shape.type === "circle"){
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke()
        }
        else if(shape.type === "pencil"){
            if(shape.points.length<2) return;

            ctx.beginPath();

             ctx.moveTo(shape.points[0].x,shape.points[0].y);
              for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }

    ctx.stroke();

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