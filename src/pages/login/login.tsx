import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../slices/userSlice';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
        await dispatch(loginUser({ email, password })).unwrap();
        navigate(location.state?.from || '/', { replace: true });
    } catch (error) {
        setErrorMessage('Неверный логин или пароль.');
    }
  };



  return (
    <LoginUI
      errorText={errorMessage}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};