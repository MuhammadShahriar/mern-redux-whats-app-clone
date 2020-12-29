import { createSlice } from '@reduxjs/toolkit';

export const currChatSlice = createSlice({
  name: 'currChat',
  initialState: {
    friend: null,
  },
  reducers: {
    initCurrChat: (state, action) => {
      state.friend = action.payload;
    },
  },
});

export const { initCurrChat } = currChatSlice.actions;
export const selectCurrChat = state => state.currChat.friend;
export default currChatSlice.reducer;