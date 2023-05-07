import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        getProduct(id: $id) {
            name
            price
            existence
        }
    }
`

const UPDATE_PRODUCT = gql`
    mutation updateProduct($id: ID!, $input: ProductInput) {
        updateProduct(id:$id, input:$input) {
            id
            name
            existence
            price
        }
    }
`

const EditProduct = () => {
    const router = useRouter()
    const { query : { id } } = router
    // console.log(id )

    //Consultar para obtener el producto
    const { data, loading, error} = useQuery(GET_PRODUCT, {
        variables: {
            id
        }
    })

    //Mutation para modificar el producto
    const [ updateProduct ] = useMutation(UPDATE_PRODUCT)

    //Schema de validacion
    const schemaValidation = Yup.object({
        name: Yup.string()
                .required('El nombre del producto es obligatorio'),
        existence: Yup.number()
                .required('Agrega una cantidad disponible')
                .positive('El valor no puede ser negativo')
                .integer('La existencia debe ser en numeros enteros'),
        price: Yup.number()
                .required('El precio del producto es obligatorio')
                .positive('El valor no puede ser negativo')
    });

    // console.log(data)
    // console.log(loading)
    // console.log(error)

    if(loading) return 'Cargando...'
    if(!data) return 'Accion No Permitida'

    const updateInfoProduct = async values => {
        // console.log(values)
        const { name, price, existence } = values

        try {
            const { data } = await updateProduct({
                variables: {
                    id,
                    input: {
                        name,
                        price,
                        existence
                    }
                }
            })
            console.log(data)
            //Mostrar Alerta
            Swal.fire(
                'Exito',
                'Haz editado el producto correctamente.',
                'success'
            )

            //Redirigir hacia producto
            router.push('/products')

        } catch (error) {
            console.log(error)
        }
    }

    const { getProduct } = data;


  return (
      <Layout>
        <h1 className="text-2xl text-purple-800 hover:text-purple-700 font-bold transition-all duration-300">Editar Producto</h1>
      
        <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        enableReinitialize
                        initialValues={ getProduct }
                        validationSchema={ schemaValidation }
                        onSubmit={ values => {
                            updateInfoProduct(values)
                        }}
                    >

                        { props => {
                            return (


                        <form
                            className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={props.handleSubmit}
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
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.name}
                            />
                            </div>

                            { props.touched.name && props.errors.name ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{props.errors.name}</p>
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
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.existence}
                            />
                            </div>

                            { props.touched.existence && props.errors.existence ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{props.errors.existence}</p>
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
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.price}
                            />
                            </div>
    
                            { props.touched.price && props.errors.price ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{props.errors.price}</p>
                                </div>
                            ) : null }
    
                            <input
                            type="submit"
                            className='bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg uppercase mt-5 p-2 text-white font-bold  w-full shadow-xl'
                            value="Editar Producto"

                            />

                        </form>

                            )
                        }}


                    </Formik>

                </div>
            </div>
      
      </Layout>
  )
}

export default EditProduct