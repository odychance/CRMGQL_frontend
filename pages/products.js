import Layout from '../components/Layout'
import { gql, useQuery } from '@apollo/client'
import Product from '../components/Product'

const GET_PRODUCT = gql`
  query getProducts {
    getProducts {
      id
      name
      existence
      price
    }
  }
`

const Products = () => {

  //Consultar los productos
  const { data, loading, error } = useQuery(GET_PRODUCT)

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return null

  return (
    <div>
      <Layout>
      <h1 className="text-2xl text-purple-800 hover:text-purple-700 font-bold transition-all duration-300">Productos</h1>

      <div className='overflow-x-scroll'>
        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-purple-900'>
            <tr className='text-white'>
              <th className='w-auto py-2 hover:text-purple-200'>Nombre</th>
              <th className='w-32 py-2 hover:text-purple-200'>Stok</th>
              <th className='w-32 py-2 hover:text-purple-200'>Precio</th>
              <th className='w-40 py-2 hover:text-purple-200'>Eliminar</th>
              <th className='w-40 py-2 hover:text-purple-200'>Editar</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.getProducts.map( product => (
              <Product
                key={product.id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
      </Layout> 
    </div>
  )
}

export default Products