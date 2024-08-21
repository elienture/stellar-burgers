import { configureStore } from '@reduxjs/toolkit';
import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  openOrderModal,
  resetOrderModal,
  initialState
} from '../burgerSlice';
import { TOrder } from '@utils-types';

const store = configureStore({
  reducer: {
    burger: burgerReducer
  }
});

const mockBunData = {
  id: '123',
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
};

const mockIngredientData = {
  id: '12345',
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
};

const mockSauceData = {
  id: '321',
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0
};

describe('Тестирование редьюсера burgerSlice', () => {
  test('Тестирование исходного состояния', () => {
    expect(store.getState().burger).toEqual(initialState);
  });
  test('Тестирование экшена модального окна с заказом', () => {
    const state = initialState;

    const mockOrderData: TOrder = {
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
    };
    const action = openOrderModal(mockOrderData);
    const newState = burgerReducer(state, action);

    expect(newState.orderModalData).toEqual(action.payload);
  });
  test('Тестирование экшена ресета заказа', () => {
    const state = {
      ...initialState,
      elements: [mockBunData, mockIngredientData, mockSauceData]
    };
    const action = resetOrderModal();
    const newState = burgerReducer(state, action);
    expect(newState.orderModalData).toBeNull();
  });

  test('Тестирование экшена добавления ингредиента', () => {
    const action = addIngredient(mockIngredientData);
    store.dispatch(action);
    expect(store.getState().burger.elements).toContainEqual(mockIngredientData);
  });
  test('Тестирование экшена удаления ингредиента', () => {
    const state = {
      ...initialState,
      elements: [mockBunData, mockIngredientData, mockSauceData]
    };
    const action = removeIngredient(mockIngredientData.id);
    const newState = burgerReducer(state, action);
    expect(newState.elements).not.toContainEqual(mockIngredientData);
  });
  test('Тестирование экшена изменения порядка ингредиентов', () => {
    const state = {
      ...initialState,
      elements: [mockBunData, mockIngredientData, mockSauceData]
    };
    const action = moveIngredient({ id: mockSauceData.id, direction: 'up' });
    const newState = burgerReducer(state, action);
    expect(newState.elements).toEqual([
      mockBunData,
      mockSauceData,
      mockIngredientData
    ]);
  });
});
