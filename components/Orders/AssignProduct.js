import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import OrderContext from '../../context/pedidos/OrderContext'

const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
            id
            name
            existence
            price
        }
  }
`

const AssignProduct = () => {

    //State local del componente
    const [ products, setProducts ] = useState([])

    //context de pedidos
    const orderContext = useContext(OrderContext)
    const { addProduct } = orderContext


    //consulta a la DB
    const { data, loading, error } = useQuery(GET_PRODUCTS)

    useEffect(() => {
        //TODO: funcion para pasar a order state
        addProduct(products)

    }, [products])

    // console.log(data)
    // console.log(loading)
    // console.log(error)

    const selectProduct = product => {
        setProducts(product)
    }

    if(loading) return null
    const { getProducts } = data

  return (
    <>
            <p
                className='text-purple-600 hover:text-purple-800 border-l-4 pl-2 bg-gray-100 rounded shadow border-purple-800 text-sm mt-8 mb-2 px-2 py-2 transition-all duration-300'
            > 2.- Selecciona o busca los productos</p>

            <Select
                className='mt-3 border-2 shadow-sm border-purple-400 hover:border-purple-700 rounded-md transition-all duration-300'
                options={ getProducts }
                onChange={ selected => selectProduct(selected)}
                getOptionValue={ client => client.id}
                getOptionLabel={ client => `${client.name} - ${client.existence} Disponible(s)`}
                placeholder="Seleccione un producto o productos..."
                noOptionsMessage={() => 'No hay resultados'}
                isMulti={true}


                //Att a esto...
                id="long-value-select"
                instanceId="long-value-select"



            />
    </>
)
}

export default AssignProduct