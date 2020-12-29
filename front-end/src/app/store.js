import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import initCurrChat from '../features/currChatSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    currChat: initCurrChat,
  },
});