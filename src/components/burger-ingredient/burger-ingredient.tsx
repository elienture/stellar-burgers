import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit'; //генерация уникального id

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../slices/burgerSlice';
import { TConstructorIngredient } from '@utils-types'; 

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const ingredientID: TConstructorIngredient = {
        ...ingredient,
        id: nanoid(), 
      };
      dispatch(addIngredient(ingredientID));
    };



    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);