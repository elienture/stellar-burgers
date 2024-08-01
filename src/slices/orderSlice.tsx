import { getOrdersApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// получаем заказы пользователя
export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  }
});

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectIsLoading = (state: RootState) => state.orders.isLoading;

export default ordersSlice.reducer;
