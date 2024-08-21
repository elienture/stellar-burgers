import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { fetchFeed, initialState } from '../feedSlice';

const store = configureStore({
  reducer: { feed: feedReducer }
});

const feedMockData = {
  success: true,
  orders: [],
  total: 10,
  totalToday: 1
};

describe('Тестирование редьюсера feedSlice', () => {
  test('Тестирование исходного состояния', () => {
    expect(store.getState().feed).toEqual(initialState);
  });
  test('Тестирование успешного fetchFeed', () => {
    const state = feedReducer(
      initialState,
      fetchFeed.fulfilled(feedMockData, 'fulfilled')
    );
    expect(state.feed).toEqual(feedMockData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  test('Тестирование отказа fetchFeed', () => {
    const error = 'error';
    store.dispatch({
      type: fetchFeed.rejected.type,
      error: error
    });
    const state = store.getState().feed;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
  test('Тестирование ожидания fetchFeed', () => {
    const state = feedReducer(initialState, fetchFeed.pending('pending'));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
});
