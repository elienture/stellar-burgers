import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { initialState, fetchUserOrders } from '../orderSlice';

const store = configureStore({
  reducer: { orders: orderReducer }
});

const mockOrdersData = [
  {
    _id: '66bce295119d45001b4ffa0a',
    name: 'Краторный астероидный spicy био-марсианский бургер',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa094a',
      '643d69a5c3f7b9001cfa0942'
    ],
    status: 'done',
    createdAt: '2024-07-30T12:27:07.046Z',
    updatedAt: '2024-08-14T17:00:05.901Z',
    number: 49636
  }
];

describe('Тестирование редьюсера orderSlice', () => {
  test('Тестирование исходного состояния', () => {
    expect(store.getState().orders).toEqual(initialState);
  });
  test('Тестирование успешного fetchUserOrders', () => {
    const state = orderReducer(
      initialState,
      fetchUserOrders.fulfilled(mockOrdersData, 'fulfilled')
    );
    expect(state.orders).toEqual(mockOrdersData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  test('Тестирование отказа fetchUserOrders', () => {
    const error = 'error';
    store.dispatch({
      type: fetchUserOrders.rejected.type,
      error: error
    });
    const state = store.getState().orders;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
  test('Тестирование ожидания fetchUserOrders', () => {
    const state = orderReducer(
      initialState,
      fetchUserOrders.pending('pending')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
});
