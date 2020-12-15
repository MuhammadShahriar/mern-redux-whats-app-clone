import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import io from "socket.io-client";
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { auth } from './firebase';
import { login, selectUser, logout } from './features/userSlice';
import axios from './axios';
const ENDPOINT = "http://localhost:9000";

function App() {
  const [socket, setSocket] = useState(io(ENDPOINT));
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch((login({
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName
        })));
        console.log(authUser)

        axios.get(`/user/sync?email=${authUser.email}`).then((response) => {
          console.log(response.data.count)
          if ( response.data.count === 0 ) {
            axios.post ('/user/new', {
              "uid": authUser.uid,
              "name": authUser.displayName,
              "email": authUser.email,
              "photoUrl": authUser.photoURL,
              "singedIn": true,
            }).catch(err => {
              console.error(err);
              console.log(err);
            });
          }

          else {
            console.log(response.data.count)
            axios.post( `/user/login?email=${authUser.email}` )
              .then(() => console.log('Singed In'))
              .catch(err => {
                console.error(err);
              });
          }
        });

      }
      else {
        dispatch(logout());
      }
    })
  },  [dispatch])
  

  return (
    <div className="app">
      <div className = "app__body">
        {(user)? (
          <>
            <Sidebar />
            <Chat />
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}

export default App;
