import { TConstructorIngredient, TOrder } from '../utils/types';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrderResponse } from '../utils/burger-api';
import { RootState } from '../services/store';

type TBurgerState = {
  elements: TConstructorIngredient[];
  isLoading: boolean;
  error: null | SerializedError; // используем SerializedError для обработки ошибок
  orderModalData: TOrder | null;
};

const initialState: TBurgerState = {
  elements: [],
  isLoading: false,
  error: null,
  orderModalData: null
};

// отправляем новый заказ
export const fetchNewOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  'burger/fetchNewOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const burgerSliсe = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    resetOrderModal: (state) => {
      // Очищаем данные заказа при закрытии модального окна
      state.orderModalData = null; 
    },
    openOrderModal: (state, action: PayloadAction<TOrder>) => {
      state.orderModalData = action.payload;
  },
    // добавление нового ингредиента
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.elements = state.elements.filter((item) => item.type !== 'bun');
      }
      state.elements.push(action.payload);
    },
    // удаление ингредиента
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(
        (item) => item.id !== action.payload
      );
    },
    // изменение порядка ингредиентов
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const { id, direction } = action.payload;
      const currentIndex = state.elements.findIndex((item) => item.id === id);
      if (currentIndex === -1) return;
      const newArray = [...state.elements];

      if (direction === 'up' && currentIndex > 0) {
        const temp = newArray[currentIndex];
        newArray[currentIndex] = newArray[currentIndex - 1];
        newArray[currentIndex - 1] = temp;
      } else if (direction === 'down' && currentIndex < newArray.length - 1) {
        const temp = newArray[currentIndex];
        newArray[currentIndex] = newArray[currentIndex + 1];
        newArray[currentIndex + 1] = temp;
      }

      state.elements = newArray;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewOrder.fulfilled, (state) => {
        state.elements = [];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  }
});


export const selectElements = (state: RootState) => state.burger.elements;
export const selectIsLoading = (state: RootState) => state.burger.isLoading;
export const selectOrderModalData = (state: RootState) => state.burger.orderModalData;

export const { addIngredient, removeIngredient, moveIngredient, resetOrderModal, openOrderModal } =
  burgerSliсe.actions;

export default burgerSliсe.reducer;
