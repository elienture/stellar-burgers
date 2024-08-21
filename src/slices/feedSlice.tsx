import { getFeedsApi, TFeedsResponse } from '../utils/burger-api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

type TFeedState = {
  feed: { orders: TOrder[]; total: number | null; totalToday: number | null };
  isLoading: boolean;
  error: null | SerializedError;
};

export const initialState: TFeedState = {
  feed: { orders: [], total: null, totalToday: null },
  isLoading: false,
  error: null
};

// получаем feed
export const fetchFeed = createAsyncThunk<TFeedsResponse>(
  'burger/fetchFeed',
  async () => {
    const data = await getFeedsApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  }
});

export const selectFeed = (state: RootState) => state.feed.feed;
export const selectIsLoading = (state: RootState) => state.feed.isLoading;

export default feedSlice.reducer;
