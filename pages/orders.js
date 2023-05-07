import { gql, useQuery } from '@apollo/client'
import Layout from '../components/Layout'
import Order from '../components/Order'

const GET_ORDERS = gql`
  query getOrdersSeller {
    getOrdersSeller {
      id
      seller
      total
      date
      state
      client {
        id
        name
        surname
        email
        telephone
      }
      order {
        amount
        id
        name
      }
    }
  }
`

const Orders = () => {

  const { data, loading, error } = useQuery(GET_ORDERS)

  if(loading) return 'Cargando...'

  const { getOrdersSeller } = data

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Pedidos</h1>
      
        { getOrdersSeller.length === 0 ? (
          <p className='mt-5 text-center text-xl uppercase text-purple-800 hover:text-purple-700 transition-all duration-300'>no hay pedidos registrados.</p>
        ) : (
          getOrdersSeller.map( order => (
            <Order 
              key={order.id}
              order={order}
            />
          ))
        )}

      </Layout> 
    </div>
  )
}

export default Orders