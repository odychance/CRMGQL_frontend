import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import OrderContext from '../../context/pedidos/OrderContext'

const GET_CLIENTS_SELLER = gql`
    query getClientsSeller {
        getClientsSeller {
            id
            name
            surname
            company
            email
        }
    }
`

const AssignClient = () => {

    //Use State para los sabores
    const [ client, setClient ] = useState([])

    //Context de pedidos
    const orderContext = useContext(OrderContext)
    const { addClient } = orderContext

    //Consultar la DB
    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER)

    // console.log(data)
    // console.log(loading)
    // console.log(error)
    
    useEffect(() => {
        addClient(client)
        
    }, [client])
    
    const selectClient = clients => {
        setClient(clients)
    }

    //Resultados de la consulta
    if(loading) return null

    const { getClientsSeller } = data
    
  return (
      <>
            <p
                className=' text-purple-600 hover:text-purple-800 border-l-4 pl-2 bg-gray-100 rounded border-purple-800 text-sm mt-4 mb-2 px-2 py-2 transition-all duration-300 shadow'
            > 1.- Asignar un cliente al pedido</p>

            <Select
                className='mt-3 border-2 shadow-sm border-purple-400 hover:border-purple-700 rounded-md transition-all duration-300'
                options={ getClientsSeller }
                onChange={ selected => selectClient(selected)}
                getOptionValue={ client => client.id}
                getOptionLabel={ client => client.name}
                placeholder="Seleccione el cliente..."
                noOptionsMessage={() => 'No hay resultados'}


                //Att a esto...
                id="long-value-select"
                instanceId="long-value-select"



            />
      
      </>
    )
}

export default AssignClient