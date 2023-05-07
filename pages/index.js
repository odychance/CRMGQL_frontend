import Head from 'next/head'
import Layout from '../components/Layout'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import client from '../config/apollo'
import Client from '../components/Client'

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

const index = () => {

  const router = useRouter()

  //Consulta de apollo
  const { data, loading, error } = useQuery(GET_CLIENTS_SELLER)
  console.log(data)
  console.log(loading)
  console.log(error)

  if(loading) return 'Cargando...'

  //Si no hay informacion
  if(!data?.getClientsSeller) {
    client.clearStore()
    router.push('/login')
    return null
  }

    // { (!data.getClientsSeller) ? (
    //     client.clearStore()
    //     router.push('/login');
    //     return null
    //   ) : ('') }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-purple-800 hover:text-purple-700 font-bold transition-all duration-300">Clientes</h1>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-purple-900'>
              <tr className='text-white'>
                <th className='w-2/5 py-2 hover:text-purple-200'>Nombre</th>
                <th className='w-1/5 py-2 hover:text-purple-200'>Empresa</th>
                <th className='w-1/5 py-2 hover:text-purple-200'>Email</th>
                <th className='w-40 py-2 hover:text-purple-200'>Eliminar</th>
                <th className='w-40 py-2 hover:text-purple-200'>Editar</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {data.getClientsSeller.map( client => (
                <Client
                  key={client.id}
                  client={client}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Layout> 
    </div>
  )
}

export default index