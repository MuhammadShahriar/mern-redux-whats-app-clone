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
import { selectCurrChat } from './features/currChatSlice';
import axios from './axios';
import Swal from 'sweetalert2';
import { useSocket } from './SocketProvider';
const ENDPOINT = "http://localhost:9000";

function Chat() {
    const socket = useSocket();
    const [input, setInput] = useState(() => {
        return "";
    });
    const [messages, setMessages] = useState(() => {
        return [];
    });
    const user = useSelector(selectUser);
    const friend = useSelector(selectCurrChat);

    useEffect(() => {
        if (socket == null) return;
        socket.on('recieveMessage', (data) => {
            const msg = {
                message: data.message,
                sender: data.sender,
                receiver: data.receiver,
                timestamp: data.timestamp,
                status: "seen"
            }

            setMessages ( (preV) => {
                return [...preV, msg]
            });
            
        });

        return () => socket.off('recieveMessage')
    }, [socket])

    useEffect(() => {
        if(user && friend ) {
            setMessages([]);
            axios.get(`/chat/sync?user=${user.email}&friend=${friend.email}`).then((response) => {
                
                response.data.forEach( (item) => {
                    const msg = {
                        message: item.message,
                        sender: item.sender,
                        receiver: item.receiver,
                        timestamp: item.timestamp,
                        status: "seen"
                    }
                    setMessages ( (preV) => {
                        return [...preV, msg];
                    });
                });

            });
        }
    }, [user, friend])

    const sendMessage = (e) => {
        e.preventDefault();

        const msg = {
            message: input,
            sender: user.email,
            receiver: friend.email,
            timestamp: new Date(),
            status: "seen"
        }
        socket.emit ( "sendMessage", msg);
        setMessages ( (preV) => {
            return [...preV, msg];
        });

        setInput ("");
    }

    return (
        <div className = "chat" >
            <div className = "chat__header">
                 <Avatar src = "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118589703_1025868897884938_4756722051990937297_n.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeGND08fnLT9_xk4yAYKaGJn2ujioMMe0zza6OKgwx7TPJOZtKu8I532frG8UBMFLtQEo0kIsWGSsGd0nFZrminD&_nc_ohc=wSOQYVJi9Z8AX-jL5KK&_nc_ht=scontent-hkt1-1.xx&oh=0e7174a4e18bce7ab9e79b362ac39949&oe=5FED9E3D" />

                <div className = "chat__headerInfo">
                    { friend?(
                    <h3>   {friend.email}</h3>

                    ) : (
                        <h3>No one</h3>
                    ) }
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
                {
                    messages.map ((messageDetail, id) => (
                        
                    <div key = {id} className = {`chat__message tooltiptail ${messageDetail.sender === user.email && "chat__receiver"}`}>
                        <p className = "chat__messageText" >
                            {messageDetail.message}
                        </p>
                        {/* <span className = "chat__timestamp">
                            {messageDetail.timestamp}
                        </span> */}
                    </div>
                    ))
                }

            </div>
            

            
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
