
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home(){
  const [roomId,setRoomId] = useState("");
  const router = useRouter();

  return <div style= {{
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    height : "100vh",
    width : "100vw"
  }}>
    <div>
      <input value = {roomId} style = {{ padding : 10}} onChange = {
      (e)=>{
        setRoomId(e.target.value);
      }
    } type = "text" placeholder="Room Id"/>

    <button onClick = {
      ()=>{
        router.push(`/room/${roomId}`)
      } 
    }  style = {{ padding : 10}}>Join Room</button>
    </div>
  </div>
}
