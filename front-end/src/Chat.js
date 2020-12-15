import React, { useEffect, useState } from 'react'
import './Chat.css'
import { Avatar, IconButton } from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import io from "socket.io-client";
import MicIcon from '@material-ui/icons/Mic';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
const ENDPOINT = "http://localhost:9000";

function Chat() {
    const [socket, setSocket] = useState(io(ENDPOINT));
    const [input, setInput] = useState("");
    const user = useSelector(selectUser);
    const [messages, setMessages] = useState("ok");

    useEffect(() => {
        socket.on('recieveMessage', ({message, sender, receiver, timestamp, status}) => {
            if ( sender === user.email ) {
                //setMessages( ...messages, {message, sender, receiver, timestamp, status} );
                setMessages(message);
            }

            //console.log("Yes", message, user.email)
        });

        //console.log(messages)
    }, [socket])

    const sendMessage = (e) => {
        e.preventDefault();

        socket.emit ( "sendMessage", {
            message: input,
            sender: user.email,
            receiver: "shahriarcsecu76@gmail.com",
            timestamp: new Date(),
            status: "seen"
        } );

        setInput ("");
    }

    return (
        <div className = "chat" >
            <div className = "chat__header">
                 <Avatar src = "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118589703_1025868897884938_4756722051990937297_n.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeGND08fnLT9_xk4yAYKaGJn2ujioMMe0zza6OKgwx7TPJOZtKu8I532frG8UBMFLtQEo0kIsWGSsGd0nFZrminD&_nc_ohc=wSOQYVJi9Z8AX-jL5KK&_nc_ht=scontent-hkt1-1.xx&oh=0e7174a4e18bce7ab9e79b362ac39949&oe=5FED9E3D" />

                <div className = "chat__headerInfo">
                    <h3>Shahriar</h3>
                    <p>last seen</p>
                </div>

                <div className = "chat__headerRight">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    
                </div>

            </div>

            
            <div className = "chat__body">
                <div className = {`chat__message tooltiptail ${true && "chat__receiver"}`}>
                    <p className = "chat__messageText" >
                    hey this is big message. just for testing

For each node (for example x), we keep three integers : 1.t[x] = Answer for it's interval. 2. o[x] = The number of $($s after deleting the brackets who belong to the correct bracket sequence in this interval whit length t[x]. 3. c[x] = The number of $)$s after deleting the brackets who belong to the correct bracket sequence in this interval whit length t[x]
                    </p>
                    <span className = "chat__timestamp">
                        12:34
                    </span>
                </div>

                
                <div className = {`chat__message`}>
                    <p className = "chat__messageText" >
                    hey this is big message. just for testing

For each node (for example x), we keep three integers : 1.t[x] = Answer for it's interval. 2. o[x] = The number of $($s after deleting the brackets who belong to the correct bracket sequence in this interval whit length t[x]. 3. c[x] = The number of $)$s after deleting the brackets who belong to the correct bracket sequence in this interval whit length t[x]
                    </p>
                    <span className = "chat__timestamp">
                        00:49
                    </span>
                </div>

            </div>
            
            <p> {messages} </p>

            
            <div className = "chat__footer">
                <InsertEmoticonIcon />
                <AttachFileIcon />
                <form>
                    <input
                        value = {input}
                        onChange = {(e) => setInput ( e.target.value )}
                        placeholder = "Send a message"
                        type = "text" 
                    />

                    <button 
                        type = "submit"
                        onClick = {sendMessage}
                    >
                    </button>
                </form>
                <MicIcon fontSize = "large" />
            </div>


        </div>
    )
}

export default Chat
