import { useSelector } from '../../services/store';
import { selectLoading, selectUser } from '../../slices/userSlice';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  unAuthOnly?: boolean;
};

export const ProtectedRoute = ({
  children,
  unAuthOnly
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const location = useLocation();

  if (loading) return <Preloader />;

  if (!user && !unAuthOnly) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (user && unAuthOnly) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};