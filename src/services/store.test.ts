import { rootReducer, store } from './store';
import userReducer from '../slices/userSlice';
import burgerReducer from '../slices/burgerSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/orderSlice';
import feedReducer from '../slices/feedSlice';

describe('Тестирование инициализации rootReducer', () => {
  test('RootReducer возвращает начальное состояние', () => {
    const state = store.getState();
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' }); //  редьюсер вызывается без начального состояния
    expect(newState).toEqual(state);
  });
});
