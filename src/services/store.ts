import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerReducer from '../slices/burgerSlice';
import userReducer from '../slices/userSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/orderSlice';
import feedReducer from '../slices/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burger: burgerReducer,
  user: userReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;