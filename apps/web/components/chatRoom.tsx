import { BACKEND_URL } from "../app/config"
import axios from "axios";

async function getChats(roomId : string){
    const response =await  axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.msgs; 


}


export async function ChatRoom({id} : {
    id : string
}){
    const msgs = await getChats(id);
     return (
    <div>
      {msgs.map((msg: any) => {
        return (
          <div key={msg.id}>
            {msg.msg}
          </div>
        );
      })}
    </div>
  );
}