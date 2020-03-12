import React, {Component} from 'react';
import axios from 'axios';

import Aux from '../../hoc/Aux/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import PurchasedModal from '../../components/UI/Modal/PurchasedModal';
import PurchasedBurgers from '../../components/Burger/PurchasedBurgers/PurchasedBurguers';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 1
}

class BurgerBuilder extends Component {
    state = {
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        purchasedBurgers: [],
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        showPurchasedHamburgers: false
    };

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount= oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) return;
        const updatedCount= oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false, showPurchasedHamburgers: false});
    }

    purchasedBurgersCloseHandler = () => {
        this.setState({showPurchasedHamburgers: false});
    }

    purchaseContinueHandler = () => {
        const data = {...this.state.ingredients}
    
        axios.post(process.env.REACT_APP_MINI_KUBURGER_BACKEND_URL, data)
            .then(response => {
                alert("Compra feita com sucesso!");
                this.setState({
                    ingredients : {
                        salad: 0,
                        bacon: 0,
                        cheese: 0,
                        meat: 0
                    },
                    totalPrice: 4,
                    purchaseable: false,
                    purchasing: false
                });
            })
            .catch(error => {
                alert(error);
            });
    }

    purchasedBurgersHandler = () => {
        axios.get(process.env.REACT_APP_MINI_KUBURGER_BACKEND_URL)
            .then(response => {
                if (response.data !== null) {
                    this.setState({purchasedBurgers: response.data, showPurchasedHamburgers: true});
                } else {
                    this.setState({showPurchasedHamburgers: true});
                }
            })
            .catch(error =>{
                alert("Falha ao obter dados do backend!");
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>

                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}/>
                </Modal>

                <PurchasedModal show={this.state.showPurchasedHamburgers} modalClosed={this.purchasedBurgersCloseHandler}>
                    <PurchasedBurgers ingredients={this.state.purchasedBurgers} />
                </PurchasedModal>

                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable} 
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}
                    purchasedBurgers={this.purchasedBurgersHandler}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;
