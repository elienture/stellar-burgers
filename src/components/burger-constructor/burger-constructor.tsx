import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { selectElements, selectIsLoading, selectOrderModalData, resetOrderModal, openOrderModal, fetchNewOrder } from '../../slices/burgerSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const elements = useSelector(selectElements);
  const user = useSelector(selectUser);
  const orderModalData = useSelector(selectOrderModalData);


  const constructorItems = useMemo(() => {
    const bun = elements.find((item) => item.type === 'bun');
    const otherIngredients = elements.filter((item) => item.type !== 'bun');
    return {
      bun: bun ? { ...bun, id: bun._id } : null,
      ingredients: otherIngredients.map((ingredient) => ({
        ...ingredient
      }))
    };
  }, [elements]);

  const onOrderClick = () => {
    if (!constructorItems.bun || !constructorItems.ingredients.length) return;
    if (!user) return navigate('/login');

    const ingredients = [
      constructorItems.bun.id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    
    dispatch(fetchNewOrder(ingredients))
      .unwrap()
      .then((response) => {
        const newOrder = response.order;
        dispatch(openOrderModal(newOrder)); // 
      })
      .catch((err) => {
        console.log('Ошибка при оформлении заказа', err);
      });
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModal()); 
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};