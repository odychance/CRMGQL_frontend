import React, { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import Swal from 'sweetalert2'

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: OrderInput) {
        updateOrder(id: $id, input: $input) {
            state
        }
    }
`

const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id) 
    }
`

const GET_ORDERS = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
        }
    }
`

const Order = ({order}) => {

    const { id, total, client: { name, surname, telephone, email }, client, state } = order

    //Mutation para cambiar stado del pedido
    const [ updateOrder ] = useMutation(UPDATE_ORDER)
    const [ deleteOrder ] = useMutation(DELETE_ORDER, {
        update(cache) {
            //Obtener una copia del pedido
            const { getOrdersSeller } = cache.readQuery({ query: GET_ORDERS })

            //Reescribir el cache
            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersSeller: getOrdersSeller.filter( currentOrder => currentOrder.id !== id)
                }
            })
        }
    })

    const [ stateOrder, setStateOrder ] = useState(state)
    const [ designState, setDesignState ] = useState('')

    useEffect(() => {
        if(stateOrder) {
            setStateOrder(stateOrder)
        }
        designedState()
    }, [ stateOrder ])

    //Funcion que modifica el color del pedido por estado
    const designedState = () => {
        if(stateOrder === 'PENDIENTE') {
            setDesignState('border-yellow-500 hover:border-yellow-600')
        } else if(stateOrder === 'COMPLETADO') {
            setDesignState('border-green-500 hover:border-green-600')
        } else {
            setDesignState('border-red-500 hover:border-red-600')
        }
    }

    const changeStateOrder = async newState => {
        try {
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        state: newState,
                        client: order.client.id
                    }
                }
            })
            setStateOrder(data.updateOrder.state)
        } catch (error) {
            console.log(error)
        }
    }

    //Elimiar el cliente
    const confirmDeleteOrder = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este Pedido?',
            text: "No podras revertir eta accion una vez aceptada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6b21a8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar!'
          }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = await deleteOrder({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        'Eliminado',
                        data.deleteOrder,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                } 

            } else if (!result.isConfirmed){
                Swal.fire(
                    'Cancelado',
                    'Haz cancelado la acción',
                    'error'
                )        
            }
          })
    }


  return (
    <div className={` ${designState} border-t-4 border-l-4 mt-4 bg-white rounded-lg p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg transition-all duration-300`}>
        <div className='items-center justify-center'>
            <p className='font-bold text-purple-700'> Cliente: {name} {surname}</p>

            { email && (
                <p className='flex items-center my-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {email}
                </p>
            )}

            { telephone && (
                <p className='flex items-center my-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {telephone}
                </p>
            )}

            <h2 className='text-purple-700 font-bold mt-10'>Estado Pedido: </h2>

            <select
                className='mt-2 appearance-none bg-purple-600 border-2 border-purple-700 text-white p-2 text-center rounded leading-tight focus:outline-none hover:bg-purple-700 hover:border-purple-600 uppercase text-xs font-bold transition-all duration-300}'
                value={stateOrder}
                onChange={ e => changeStateOrder( e.target.value ) }
            >
                <option value="CANCELADO">CANCELADO</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="COMPLETADO">COMPLETADO</option>
            </select>

        </div>
        <div className='items-center justify-center'>
            <h2 className='text-purple-700 font-bold'>Resumen del Pedido</h2>
            { order.order.map( article => (
                <div key={article.id} className="mt-4">
                    <p className='text-sm text-gray-600'>Producto: 
                        <span className='font-bold mb-3'> { article.name }</span>
                    </p>
                    <p className='text-sm text-gray-600'>Cantida: 
                        <span className='font-bold mb-3'> { article.amount }</span>
                    </p>

                    <p className='text-purple-700 mt-3 font-bold'> Total a pagar:
                        <span className='font-light'> $ {total}</span>
                    </p>

                    <button
                        className='flex items-center mt-4 bg-red-600 hover:bg-red-700 px-5 py-2 inline-block text-white rounded uppercase leading-tight text-xs font-bold transition-all duration-300'
                        onClick={() => confirmDeleteOrder()}
                    >
                        Eliminar Pedido
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    </div>
    )
}

export default Order