import React from 'react';
import MiniBurger from '../MiniBurger';
import './PurchasedBurgers.css';

const purchasedBurgers = (props) => {
    let key = 0;
    console.log(props.ingredients);
    const burgers = props.ingredients;
    let purchased = burgers.map((burgerIngredients) => {
        key ++;
        return <MiniBurger key={key} ingredients={burgerIngredients} />;
    });

    return (
        <div className='PurchasedBurgers'>{purchased}</div>
    );
}

export default purchasedBurgers;