import { Canvas } from "@/app/components/CanvasClient"

export default function CanvasPage({params} : {
    params : {
        roomId : string 
    }
}){
    const roomId = params.roomId
    console.log(roomId)
   
    return <Canvas roomId = {roomId} />
}