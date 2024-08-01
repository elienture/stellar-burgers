import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';

interface ingredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: ingredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// получаем ингредиенты с сервера
export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'burger/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSliсe = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIsLoading = (state: RootState) => state.ingredients.isLoading;

export default ingredientsSliсe.reducer;