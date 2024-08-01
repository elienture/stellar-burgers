import {
  getUserApi,
  registerUserApi,
  TRegisterData,
  TAuthResponse,
  loginUserApi,
  TLoginData,
  updateUserApi,
  TUserResponse,
  logoutApi
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../services/store';
import { deleteCookie, setCookie } from '../utils/cookie';

type TUserState = {
  userData: TUser | null;
  isLoading: boolean;
  error: string | null
};

const initialState: TUserState = {
  userData: null,
  isLoading: false,
  error: null
};

// получаем данные о пользователе 
export const fetchUser = createAsyncThunk<{ user: TUser }>(
  'user/fetchUser',
  async () => {
    const data = await getUserApi();
    return data;
  }
);

// вход в личный кабинет (логин, пароль)
export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/loginUser',
  async (data) => {
    const response = await loginUserApi(data);
    return response;
  }
);

// регистрация пользователя при отсутствии личного кабинета
export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/registerUser',
  async (registerData) => {
    const response = await registerUserApi(registerData);
    return response;
  }
);

// изменение данных пользователя
export const updateUser = createAsyncThunk<TUserResponse, Partial<TRegisterData>>(
  'user/updateUser',
  async (userData) => {
    const response = await updateUserApi(userData);
    return response;
  }
);

// выход из личного кабинета
export const logoutUser = createAsyncThunk<{ success: boolean }>(
  'user/logoutUser',
  async () => {
    const response = await logoutApi();
    return response;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить данные';
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось войти';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось зарегистрироваться';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось обновить данные';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось выйти';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  }
});

export const selectUser = (state: RootState) => state.user.userData;
export const selectLoading = (state: RootState) => state.user.isLoading;

export default userSlice.reducer;
