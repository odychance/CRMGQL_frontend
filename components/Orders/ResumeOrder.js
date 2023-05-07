import React, { useContext } from 'react'
import OrderContext from '../../context/pedidos/OrderContext'
import ResumeProduct from './ResumeProduct'

const ResumeOrder = () => {

    const { products } = useContext(OrderContext)
    // console.log(products)


  return (
    <>
        <p
            className='text-purple-600 hover:text-purple-800 bg-gray-100 shadow border-l-4 pl-2 bg-white rounded border-purple-800 text-sm mt-8 mb-2 px-2 py-2 transition-all duration-300'
        > 3.- Ajusta las cantidades del producto</p>

        { products.length > 0 ? (
            <>
                {products.map( product => (
                    <ResumeProduct 
                        key={product.id}
                        product={product}
                    />
                ))}
            </>
        ) : (
            <p className='mt-5 text-sm text-center uppercase'>No hay productos registrados.</p>
        )}
    
    </>
    )
}

export default ResumeOrder