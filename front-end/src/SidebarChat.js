import { Avatar } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React from 'react'
import './SidebarChat.css'


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
    
    const createChat = () => {
        const roomName = prompt ( "Enter a room name" );
    };


    return !addNewChat ? (
 
        <div className = "sidebarChat" >
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
