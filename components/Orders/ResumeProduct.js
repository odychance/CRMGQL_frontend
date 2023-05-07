import React, { useContext, useState, useEffect } from 'react'
import OrderContext from '../../context/pedidos/OrderContext'

const ResumeProduct = ({product}) => {

    //Context de pedidos
    const orderContext = useContext(OrderContext)
    const { amountProducts, updateTotal } = orderContext

    const [ amount, setAmount] = useState(0)

    useEffect(() => {
        updateAmount()
        updateTotal()
    }, [ amount ])

    const updateAmount = () => {
        const newProduct = { ...product, amount: Number( amount ) }
        amountProducts(newProduct)
    }

    const { name, price } = product

  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
        <div className='md:w-2/4 mb-2 md:mb-0 w-2/3  p-1 border-solid border-2 border-purple-400 rounded-md hover:border-purple-700 bg-white transition-all duration-300'>
            <p className='text-sm font-bold text-gray-800 hover:text-black transition-all duration-300'>{name}</p>
            <p className='text-md transition-all duration-300'>$ {price}</p>

        </div>
        <input
            type="number"
            placeholder='Cantidad'
            className='hover:border-purple-700 border-purple-400 border-2 transition-all duration-300 shadow apperance-none rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
            onChange={ e => setAmount(e.target.value)}
            value={amount}
        />
    </div>
    )
}

export default ResumeProduct