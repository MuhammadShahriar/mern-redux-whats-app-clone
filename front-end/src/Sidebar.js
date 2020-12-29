import React, { useCallback, useEffect, useState } from 'react'
import './Sidebar.css'
import { Avatar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SidebarChat from './SidebarChat';
import { auth } from './firebase';
import axios from './axios';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUser } from './features/userSlice';
import { initCurrChat, selectCurrChat } from './features/currChatSlice';

function Sidebar() {

    const user = useSelector(selectUser);
    const [friendList, setFriendList] = useState([]);
    ///const [currentFriend, setCurrentFriend] = useState("");
    var cr = "";
    const friendChat = useSelector(selectCurrChat);
    const dispatch = useDispatch();

    const singOut = () => {
        axios.post( `/user/logout?email=${user.email}` )
          .then(() => console.log('Singed out'))
          .catch(err => {
            console.error(err);
        });

        auth.signOut()
    }


    useEffect (() => {
        axios.get (`/friendList/sync?user=${user.email}`)
            .then((response) => {
                console.log("hey", response.data)
                setFriendList(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);


    return (
        <div className = "sidebar" >
            
            <div className = "sidebar__header">
                <Avatar src = "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118589703_1025868897884938_4756722051990937297_n.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeGND08fnLT9_xk4yAYKaGJn2ujioMMe0zza6OKgwx7TPJOZtKu8I532frG8UBMFLtQEo0kIsWGSsGd0nFZrminD&_nc_ohc=wSOQYVJi9Z8AX-jL5KK&_nc_ht=scontent-hkt1-1.xx&oh=0e7174a4e18bce7ab9e79b362ac39949&oe=5FED9E3D" />

                <div className = "sidebar_headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>

                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>

            </div>


            
            <div className = "sidebar__search" >

                <div className = "sidebar__searchContainer">
                    <SearchIcon />
                    <input placeholder = "Search or start new chat" type = "text" />
                </div>
                
            </div>

            
            <div className = "sidebar__chats">
                <SidebarChat addNewChat />
                {console.log("friend", friendList)}
                

                { friendList.map ( (val, id) => (
                    
                        <SidebarChat
                            key = {id}
                            name = {val.friend}
                        />
                )) }

                <SidebarChat 
                    name = "js"
                />
                

            </div>
            
            <Button onClick = {singOut} >
                Log out
            </Button>



        </div>
    )
}

export default Sidebar
