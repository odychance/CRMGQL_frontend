import React, { useReducer } from 'react'
import OrderContext from './OrderContext'
import OrderReducer from './OrderReducer'

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    AMOUNT_PRODUCTS,
    UPDATE_TOTAL,
} from '../../types'
import { assertValidExecutionArguments } from 'graphql/execution/execute'

const OrderState = ({children}) => {

    //State de pedidos
    const initialState = {
        client: {},
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrderReducer, initialState)

    //Modifica el state
    const addClient = client => {
        // console.log(client)

        dispatch({
            type: SELECT_CLIENT,
            payload: client
        })
    }

    //Modifica los productos
    const addProduct = selectedProducts => {

        let newState;
        if(state.products.length > 0 ) {
            //Tomar del segundo arreglo una copia para asignarlo al primero
            newState = selectedProducts.map( product => {
                const newObject = state.products.find( productState => productState.id === product.id )
                return { ...product, ...newObject }
            })
        } else {
            newState = selectedProducts
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        })
    }

    //Modifica las cantidades de los productos
    const amountProducts = newProduct => {
        dispatch({
            type: AMOUNT_PRODUCTS,
            payload: newProduct
        })
    }

    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL
        })
    }

    return ( 
        <OrderContext.Provider
            value={{
                client: state.client,
                products: state.products,
                total: state.total,
                addClient,
                addProduct,
                amountProducts,
                updateTotal
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

export default OrderState