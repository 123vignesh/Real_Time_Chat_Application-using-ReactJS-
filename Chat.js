import React , {useState,useEffect} from "react";
import "./Chat.css";
import queryString from "query-string";
import io from "socket.io-client";
import Header from "../Header/Header";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
let socket;
const Chat=({location})=>{
    const [name,setName] = useState("");
    const[room,setRoom]= useState("");      
    const[message,setMessage]= useState("");      
    const[messages,setMessages]= useState([]);  
    const[users,setUsers]= useState([]);      
    const ENDPOINT = "localhost:5000";  

    useEffect(()=>{
           const {name ,room}=queryString.parse(location.search);

         socket = io(ENDPOINT);
          
      
         setRoom(room);
         setName(name)
         
         socket.emit("join",{name,room},(error)=>{
             if(error){
                 alert(error);
             }
         });
        },[ENDPOINT , location.search]);
         

    useEffect(()=>{
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
          });
          
          socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
      }, []);

    const sendMessage=(event)=>{
        event.preventDefault();
           if(message){
               socket.emit("sendMessage",message,()=>setMessage(""));
           }
           
    }

return(
        <div className="outerContainer">
            <div className="container">
               <Header room={room}/>
               <Messages messages={messages}  name={name}/>
               <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>   
            </div>
            <TextContainer users={users}/>
        </div>
    );
}

export default Chat;

