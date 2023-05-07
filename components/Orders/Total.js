import React, { useContext } from 'react'
import OrderContext from '../../context/pedidos/OrderContext'

const Total = () => {

    const orderContext = useContext(OrderContext)
    const { total } = orderContext
    
  return (
    <div className=' flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-purple-400 rounded-md hover:border-purple-700 hover:bg-purple-100 transition-all duration-300'>
        <h2 className='text-gray-800 text-lg'> Total a Pagar: </h2>
        <p className='text-gray-800 mt-0 '> $ {total} </p>
    </div>
  )
}

export default Total