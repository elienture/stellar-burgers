import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { selectOrders, fetchUserOrders } from '../../slices/orderSlice';
import { fetchFeed, selectFeed, selectIsLoading } from '../../slices/feedSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const number = Number(useParams().number);
  const ingredients = useSelector(selectIngredients);
  const feed = useSelector(selectFeed);
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectIsLoading);

  const location = useLocation();

  // загрузка данных из feed и orders
  useEffect(() => {
    if (location.pathname.startsWith('/feed') && !feed.orders.length) {
      dispatch(fetchFeed());
    } else if (location.pathname.startsWith('/profile') && !orders.length) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, feed.orders.length, orders.length, location.pathname]);

  const order =
    (location.pathname.startsWith('/feed') &&
      feed.orders.find((i) => i.number === number)) ||
    (location.pathname.startsWith('/profile') &&
      orders.find((i) => i.number === number));

  const orderData = order
    ? {
        createdAt: order.createdAt,
        ingredients: order.ingredients,
        _id: order._id,
        status: order.status,
        name: order.name,
        updatedAt: order.updatedAt,
        number: order.number
      }
    : null;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) return null;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
