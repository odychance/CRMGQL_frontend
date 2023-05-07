import React from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const NEW_PRODUCT = gql`
    mutation newProduct($input: ProductInput) {
        newProduct(input: $input) {
            id
            name
            existence
            price
            created
        }
    }
`

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

const newproduct = () => {

    //Routing
    const router = useRouter()

    //Mutation de apollo
    const [ newProduct ] = useMutation(NEW_PRODUCT,{
        update(cache, { data: { newProduct } } ) {
            //Obtener objeto de cache
            const { getProducts } = cache.readQuery({ query : GET_PRODUCT })

            //Reescribir objeto
            cache.writeQuery({
                query: GET_PRODUCT,
                data: {
                    getProducts: [ ...getProducts, newProduct ]
                }
            })
        }
    })

    //formulario para nuevos productos
    const formik = useFormik({
        initialValues: {
            name: '',
            existence: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                    .required('El nombre del producto es obligatorio'),
            existence: Yup.number()
                    .required('Agrega una cantidad disponible')
                    .positive('El valor no puede ser negativo')
                    .integer('La existencia debe ser en numeros enteros'),
            price: Yup.number()
                    .required('El precio del producto es obligatorio')
                    .positive('El valor no puede ser negativo')
        }),
        onSubmit: async values => {

            const { name, existence, price } = values
            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            existence,
                            price
                        }
                    }
                })
                // console.log(data)

                //Mostrar Alerta
                Swal.fire(
                    'Correcto!',
                    'Se creo el producto correctamente',
                    'success'
                )
                //Redireccionar a Products
                router.push('/products')

            } catch (error) {
                console.log(error)
            }
        }
    })

  return (
      <Layout>
          <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Crear Nuevo Producto</h1>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-6'>
                            <label
                                className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                                htmlFor='name'
                            >
                                Nombre
                            </label>

                            <input
                                className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='name'
                                type='text'
                                placeholder="Nombre Producto"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                        />
                        </div>

                        { formik.touched.name && formik.errors.name ? (
                            <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                <p className='font-bold text-center'>{formik.errors.name}</p>
                            </div>
                        ) : null }

                        <div className='mb-6'>
                            <label
                                className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                                htmlFor='existence'
                            >
                                Stok
                            </label>

                            <input
                                className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='existence'
                                type='number'
                                placeholder="Stok Disponible"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.existence}
                        />
                        </div>

                        { formik.touched.existence && formik.errors.existence ? (
                            <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                <p className='font-bold text-center'>{formik.errors.existence}</p>
                            </div>
                        ) : null }


                        <div className='mb-6'>
                            <label
                                className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                                htmlFor='price'
                            >
                                Precio
                            </label>

                            <input
                                className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='price'
                                type='number'
                                placeholder="Precio Producto"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                        />
                        </div>
  
                        { formik.touched.price && formik.errors.price ? (
                            <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                <p className='font-bold text-center'>{formik.errors.price}</p>
                            </div>
                        ) : null }
  
                        <input
                        type="submit"
                        className='bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg uppercase mt-5 p-2 text-white font-bold  w-full shadow-xl'
                        value="Agregar Nuevo Producto"

                        />

                    </form>
                </div>
            </div>
      </Layout>
  )
}

export default newproduct