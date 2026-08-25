"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function chatRoomClient({
    messages,
    id
} : {
    messages : {message : string}[],
    id : string
}){
    const {socket,loading} = useSocket();
    const [chats,setChats] = useState(messages);
    const [currentMsg,setCurrentMsg] = useState<null | string>(null);

    useEffect(()=>{
        if(socket && !loading) {

            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id
            }))
            socket.onmessage = (e)=>{
                const parsedData = JSON.parse(e.data);
                if(parsedData.type === "chat"){
                    setChats(c=> [...c,{message : parsedData.message}])
                }
            }

        }
    },[socket,loading,id])

    return <div>
        {chats.map((m, index) => (
  <div key={index}>{m.message}</div>
))}
        <input type = "text" value = {currentMsg} onChange = {
            (e)=>{
                setCurrentMsg(e.target.value)
            }
        } />
        <button onClick = {
            ()=>{
                socket.send(JSON.stringify({
                    type : "chat",
                    roomId : id,
                    message : currentMsg
                }))

                setCurrentMsg("");
            }
        }>Send Message</button>
    </div>
}