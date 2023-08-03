import React, { useContext, useState } from 'react'
import Layout from '../components/Layout'
import AssignClient from '../components/Orders/AssignClient'
import AssignProduct from '../components/Orders/AssignProduct'
import ResumeOrder from '../components/Orders/ResumeOrder'
import Total from '../components/Orders/Total'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

//Context de pedidos
import OrderContext from '../context/pedidos/OrderContext'

const NEW_ORDER = gql`
    mutation newOrder($input: OrderInput) {
        newOrder(input: $input) {
            id
        }
    }
`

const GET_ORDERS_SELLER = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
            client
            seller
            total
            date
            state
            order {
                amount
                id
            }
        }
    }
`

const Neworder = () => {

    const [ message, setMessage ] = useState(null)

    const router = useRouter()
        
    //utilizar context y extraer sus funciones y valores
    const orderContext = useContext(OrderContext)
    const { client, products, total} = orderContext
    
    const { id } = client

    //Mutation para crear un nuevo pedido
    const [ newOrder ] = useMutation(NEW_ORDER, {
        update(cache, { data: {newOrder }}) {
            const { getOrdersSeller } = cache.readQuery({
                query: GET_ORDERS_SELLER
            })

            cache.writeQuery({
                query: GET_ORDERS_SELLER,
                data: {
                    getOrdersSeller: [...getOrdersSeller, newOrder]
                }
            })
        }
    })
    
    const validateOrder = () => {
        return !products.every( product => product.amount > 0 ) || total === 0 || client.length === 0 ? " opacity-50 cursor-not-allowed " : "" ;
    }
    
    const createNewOrder = async () => {
        
        //Remover lo no necesario de prductos
        const order = products.map(({ existence, __typename, ...product}) => product)
        // console.log(order)
        try {
            const { data } = await newOrder({
                variables: {
                    input: {
                        client: id,
                        total,
                        order
                    }
                }
            })

            //Routing
            router.push('/orders')

            //Alerta
            Swal.fire(
                'Correcto!',
                'Haz creado el pedido correctamente.',
                'success'
            )

        } catch (error) {
            setMessage(error.message)

            setTimeout(() => {
                setMessage(null)
            }, 3000);
        }
    }

    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full mt-10 max-w-sm text-gray-800 text-center mx-auto border-4 border-purple-800 rounded-lg font-bold bg-purple-100'>
                <p>{message}</p>
            </div>
        )
    }

  return (
      <Layout>
        <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Crear Nuevo Pedido</h1>

        {message && showMessage() }

        <div
            className='flex justify-center items-center'
        >
            <div
                className='flex justify-center mt-3 mb-4 px-8 pb-4 pt-6 transition-all duration-300 sm:w-full md:w-max lg:w-2/3 bg-white'
            >
                <div className='w-2/3 max-w-lg'>
                    <AssignClient />
                    <AssignProduct />
                    <ResumeOrder />
                    <Total />

                    <button
                        type='button'
                        className={`bg-purple-700 hover:bg-purple-800 transition-all duration-300 w-full mt-5 p-2 text-white uppercase font-bold rounded-md mb-5 shadow-md ${ validateOrder() }`}
                        onClick={ () => createNewOrder() }
                    >
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </div>
      </Layout>
  )
}

export default Neworder