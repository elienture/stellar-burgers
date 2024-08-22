import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  initialState,
  fetchUser,
  loginUser,
  registerUser,
  updateUser,
  logoutUser
} from '../userSlice';
import * as cookieUtils from '../../utils/cookie';

const store = configureStore({
  reducer: { user: userReducer }
});

const mockUserData = {
  name: 'elienture',
  email: 'naumanes@mail.ru',
  success: true
};

const mockAuthData = {
  refreshToken: 'fakeRefreshToken',
  accessToken: 'fakeAccessToken',
  user: mockUserData
};

const mockLocalStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
});

describe('Тестирование редьюсера userSlice', () => {

  // тестирование запроса пользовательских данных
  test('Тестирование успешного fetchUser', () => {
    const state = userReducer(
      initialState,
      fetchUser.fulfilled({ user: mockUserData }, 'fulfilled')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.userData).toEqual(mockUserData);
  });
  test('Тестирование отказа fetchUser', () => {
    const error = 'error';
    store.dispatch({
      type: fetchUser.rejected.type,
      error: { message: error }
    });
    const state = store.getState().user;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
  test('Тестирование ожидания fetchUser', () => {
    const state = userReducer(initialState, fetchUser.pending('pending'));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  // тестирование входа в ЛК
  test('Тестирование успешного loginUser', () => {
    // Mock куки с помощью jest.spyOn
    const setCookieMock = jest
      .spyOn(cookieUtils, 'setCookie')
      .mockImplementation(() => {});
    const deleteCookieMock = jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(() => {});

    store.dispatch({
      type: loginUser.fulfilled.type,
      payload: mockAuthData
    });
    const state = store.getState();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'fakeRefreshToken'
    );
    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'fakeAccessToken'
    );
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.userData).toEqual(mockUserData);

    // Сброс состояния "шпионов"
    setCookieMock.mockReset();
    deleteCookieMock.mockReset();
  });
  test('Тестирование отказа loginUser', () => {
    const error = 'error';
    store.dispatch({
      type: loginUser.rejected.type,
      error: { message: error }
    });
    const state = store.getState();
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(error);
  });
  test('Тестирование ожидания loginUser', () => {
    store.dispatch({ type: loginUser.pending.type });
    const state = store.getState();
    expect(state.user.isLoading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  // тестирование регистрации пользователя
  test('Тестирование успешного registerUser', () => {
    const setCookieMock = jest
      .spyOn(cookieUtils, 'setCookie')
      .mockImplementation(() => {});
    const deleteCookieMock = jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(() => {});

    store.dispatch({
      type: registerUser.fulfilled.type,
      payload: mockAuthData
    });
    const state = store.getState();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'fakeRefreshToken'
    );
    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'fakeAccessToken'
    );
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.userData).toEqual(mockUserData);

    setCookieMock.mockReset();
    deleteCookieMock.mockReset();
  });
  test('Тестирование отказа registerUser', () => {
    const error = 'error';
    store.dispatch({
      type: registerUser.rejected.type,
      error: { message: error }
    });
    const state = store.getState();
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(error);
  });
  test('Тестирование ожидания registerUser', () => {
    store.dispatch({ type: registerUser.pending.type });
    const state = store.getState();
    expect(state.user.isLoading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  // тестирование изменений пользовательских данных
  test('Тестирование успешного updateUser', () => {
    const mockUpdateData = {
      user: { ...mockUserData, name: 'elienture2' }
    };
    store.dispatch({
      type: updateUser.fulfilled.type,
      payload: mockUpdateData
    });
    const state = store.getState();

    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.userData).toEqual({
      name: 'elienture2',
      email: 'naumanes@mail.ru',
      success: true
    });
  });
  test('Тестирование отказа updateUser', () => {
    const error = 'error';
    store.dispatch({
      type: updateUser.rejected.type,
      error: { message: error }
    });
    const state = store.getState();
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(error);
  });
  test('Тестирование ожидания updateUser', () => {
    store.dispatch({ type: updateUser.pending.type });
    const state = store.getState();
    expect(state.user.isLoading).toBe(true);
    expect(state.user.error).toBe(null);
  });

  // тестирование выхода из ЛК
  test('Тестирование успешного logoutUser', () => {
    const setCookieMock = jest
      .spyOn(cookieUtils, 'setCookie')
      .mockImplementation(() => {});
    const deleteCookieMock = jest
      .spyOn(cookieUtils, 'deleteCookie')
      .mockImplementation(() => {});

    localStorage.setItem('refreshToken', 'fakeRefreshToken');
    store.dispatch({
      type: logoutUser.fulfilled.type
    });
    const state = store.getState();

    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(deleteCookieMock).toHaveBeenCalledWith('accessToken');
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(null);
    expect(state.user.userData).toBe(null);

    setCookieMock.mockReset();
    deleteCookieMock.mockReset();
  });
  test('Тестирование отказа logoutUser', () => {
    const error = 'error';
    store.dispatch({
      type: logoutUser.rejected.type,
      error: { message: error }
    });
    const state = store.getState();
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe(error);
  });
  test('Тестирование ожидания logoutUser', () => {
    store.dispatch({ type: logoutUser.pending.type });
    const state = store.getState();
    expect(state.user.isLoading).toBe(true);
    expect(state.user.error).toBe(null);
  });
});
