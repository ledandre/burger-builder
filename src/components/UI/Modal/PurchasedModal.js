import React, { Component } from 'react';
import Aux from '../../../hoc/Aux/Auxilliary'
import Backdrop from '../../../components/UI/Backdrop/Backdrop'

import './PurchasedModal.css';

class PurchasedModal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show;
    }

    render() {
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div 
                    className="PurchasedModal"
                    style={
                        {
                            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                            opacity: this.props.show ? '1' : '0'
                        }
                    }>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default PurchasedModal;