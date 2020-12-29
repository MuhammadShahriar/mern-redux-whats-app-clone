import { Avatar } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from './axios';
import React from 'react'
import './SidebarChat.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import Swal from 'sweetalert2'
import { initCurrChat } from './features/currChatSlice';


const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
  }));

function SidebarChat({name, addNewChat}) {
    const classes = useStyles();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    
    const initChat = () => {
      dispatch((initCurrChat({
          email: name,
      })));
    }

    
    const createChat = () => {
        const email = prompt ( "Enter a room name" );

        if ( email === user.email ) {
          Swal.fire({
            title: 'Hey...',
            icon: 'info',
            text: 'Its your account'
          });

          return;
        }

        axios.get(`/user/search?email=${email}`).then((response) => {
          console.log("User axiest", response.data.length);

          if ( response.data.length > 0 ) {
            axios.get(`/friendship/search?user=${user.email}&friend=${email}`).then((response) => {
              console.log("friendship axiest", response.data.count);

              if ( response.data.count === 0 ) {

                axios.post ('/friendship/new', {
                  "user": user.email,
                  "friend": email,
                  "timestamp": new Date(),
                }).catch(err => {
                  console.error(err);
                });

                
                axios.post ('/friendship/new', {
                  "user": email,
                  "friend": user.email,
                  "timestamp": new Date(),
                }).catch(err => {
                  console.error(err);
                });

                Swal.fire(
                  'Now you both are friends!',
                  'Friend ship has been created!',
                  'success'
                )
              }

              else {
                Swal.fire({
                  title: 'Hey...',
                  icon: 'info',
                  text: 'You both are already friends'
                });
              }
            });
          }

          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'User not found',
            })
          }
        });
    };


    return !addNewChat ? (
 
        <div onClick = {initChat} className = "sidebarChat" >
            <StyledBadge
                overlap="circle"
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                variant="dot"
            >
                <Avatar 
                    className={classes.large}
                    src = "https://scontent-hkt1-1.xx.fbcdn.net/v/t1.0-9/118589703_1025868897884938_4756722051990937297_n.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeGND08fnLT9_xk4yAYKaGJn2ujioMMe0zza6OKgwx7TPJOZtKu8I532frG8UBMFLtQEo0kIsWGSsGd0nFZrminD&_nc_ohc=wSOQYVJi9Z8AX-jL5KK&_nc_ht=scontent-hkt1-1.xx&oh=0e7174a4e18bce7ab9e79b362ac39949&oe=5FED9E3D"
                />

            </StyledBadge>
            
            <div className = "sidebarChat__info" >
                <h2>{name}</h2>
                <p>Last message....</p>
            </div>
        </div>
        
    ) : (
        <div onClick = {createChat} className = "sidebarChat">
            <h2>Add new chat</h2>
        </div>
    )
}

export default SidebarChat
