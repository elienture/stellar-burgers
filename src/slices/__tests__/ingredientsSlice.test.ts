import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, {
  initialState,
  fetchIngredients
} from '../ingredientsSlice';

const store = configureStore({
  reducer: { ingredients: ingredientsReducer }
});

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  }
];

describe('Тестирование редьюсера ingredientsSlice', () => {
  test('Тестирование исходного состояния', () => {
    expect(store.getState().ingredients).toEqual(initialState);
  });
  test('Тестирование успешного fetchIngredients', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(ingredientsMockData, 'fulfilled')
    );
    expect(state.ingredients).toEqual(ingredientsMockData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  test('Тестирование отказа fetchIngredients', () => {
    const error = 'error';
    store.dispatch({
      type: fetchIngredients.rejected.type,
      error: error
    });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
  test('Тестирование ожидания fetchIngredients', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('pending')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
});
