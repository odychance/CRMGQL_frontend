import React from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useState } from 'react'

const NEW_CLIENT = gql`
    mutation newClient($input: ClientInput) {
        newClient(input: $input) {
            id
            name
            surname
            company
            email
            telephone
        }
    }
`

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

const newclient = () => {

    const router = useRouter()

    const [ message, setMessage] = useState(null)

    //Hook de mutation para crear nuevos clientes
    const [ newClient ] = useMutation(NEW_CLIENT, {
        update(cache, { data: { newClient } } ) {
            //Obtener el objeto de cache que deseamos actualizar
            const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_SELLER })

            //Reescribimos el cache (nunca se debe modificar solo reescribir)
            cache.writeQuery({
                query: GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller : [...getClientsSeller, newClient]
                }
            })
        }
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            company: '',
            email: '',
            telephone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                    .required('El nombre del cliente es obligatorio'),
            surname: Yup.string()
                    .required('El apellido del cliente es obligatorio'),
            company: Yup.string()
                    .required('El campo empresa es obligatorio'),
            email: Yup.string()
                    .email('Email no valido')
                    .required('El apellido del cliente es obligatorio'),
        }),
        onSubmit: async values => {

            const { name, surname, company, email, telephone} = values 

            try {
                const { data } = await newClient({
                    variables: {
                        input: {
                            name,
                            surname,
                            company,
                            email,
                            telephone
                        }
                    }
                })

                router.push('/')
            } catch (error) {
                setMessage(error.message)
                setTimeout(() => {
                    setMessage('')
                }, 3000);
            }
        }
    })

    const showMessage = () => {
        return(
            <div className='bg-gray-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto rounded-lg text-gray-600 font-bold border-4 border-gray-600 shadow-xl'>
                <p>{message}</p>
            </div>
        )
    }

  return (
      <Layout>
        <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Crear Nuevo Cliente</h1>
      
        { message && showMessage() }

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
                            placeholder="Nombre Cliente"
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
                            htmlFor='surname'
                        >
                            Apellido
                        </label>

                        <input
                            className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='surname'
                            type='text'
                            placeholder="Apellido Cliente"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.surname}
                    />
                    </div>

                    { formik.touched.surname && formik.errors.surname ? (
                        <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                            <p className='font-bold text-center'>{formik.errors.surname}</p>
                        </div>
                    ) : null }

                    <div className='mb-6'>
                        <label
                            className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                            htmlFor='company'
                        >
                            Empresa
                        </label>

                        <input
                            className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='company'
                            type='text'
                            placeholder="Empresa Cliente"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.company}
                    />
                    </div>

                    { formik.touched.company && formik.errors.company ? (
                        <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                            <p className='font-bold text-center'>{formik.errors.company}</p>
                        </div>
                    ) : null }

                    <div className='mb-6'>
                        <label
                            className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                            htmlFor='email'
                        >
                            Email
                        </label>

                        <input
                            className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='email'
                            type='email'
                            placeholder="Email Cliente"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                    />
                    </div>

                    { formik.touched.email && formik.errors.email ? (
                        <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                            <p className='font-bold text-center'>{formik.errors.email}</p>
                        </div>
                    ) : null }

                    <div className='mb-6'>
                        <label
                            className='text-purple-800 hover:text-purple-900 font-bold text-sm block mb-2'
                            htmlFor='telephone'
                        >
                            Telefono
                        </label>

                        <input
                            className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='telephone'
                            type='tel'
                            placeholder="Telefono Cliente (Opcional)"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.telephone}
                    />
                    </div>

                    <input
                        type="submit"
                        className='bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg uppercase mt-5 p-2 text-white font-bold  w-full shadow-xl'
                        value="Registrar Cliente"

                    />
                </form>
            </div>
        </div>
      </Layout>
  )
}

export default newclient