import React from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import { useState } from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'

const NEW_ACCOUNT = gql `
    mutation newUser($input: UserInput) {
        newUser(input: $input) {
            id
            name
            surname
            email
        }
    }
`

const NewAccount = () => {

    const router = useRouter()

    //State para el mensaje
    const [message, setMessage] = useState(null)

    //Mutation para crear nuevos usuarios
    const [ newUser ] = useMutation(NEW_ACCOUNT)

    //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password:'',
            repeatPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('El nombre es obligatorio'),
            surname: Yup.string()
                .required('El apellido es obligatorio'),
            email: Yup.string()
                .email('El email es invalido')
                .required('El email es obligatorio'),
            password: Yup.string()
                .required('El password es obligatorio')
                .min(6, 'El password debe tener al menos 6 caracteres'),
            repeatPassword: Yup.string()
                .required('El password es incorrecto')
                .oneOf([Yup.ref('password'), null], 'Los password no coinciden')
        }),
        onSubmit: async values => {
            const { name, surname, email, password, repeatPassword } = values

            try {
                const { data } = await newUser({
                    variables: {
                        input: {
                            name,
                            surname,
                            email,
                            password
                        }
                    }
                })
                // console.log(data)

                //Usuario creado correctamente
                setMessage(`Se creo correctamente el usuario: ${data.newUser.name}`)

                setTimeout(() => {
                    setMessage(null)

                    //Redirigir usuario al Login
                    router.push('/login')

                }, 3000);

            } catch (error) {
                setMessage(error.message)
                console.log(error.message)

                setTimeout(() => {
                    setMessage('')
                }, 3000);
            }
        }
    })

    const showMessage = () => {
        return(
            <div className='bg-gray-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto rounded-lg text-purple-600 font-bold border-4 border-purple-400 shadow-xl'>
                <p>{message}</p>
            </div>
        )
    }

  return (
    <>
        <Layout>

            { message && showMessage() }

            <h1 className='text-center text-2xl text-white font-black hover:text-purple-300'>Crear Nueva Cuenta</h1>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form
                        onSubmit={formik.handleSubmit}
                        className='bg-purple-300 rounded-md shadow-md px-8 pt-6 pb-8 mb-4 '
                    >
                        <div className='mb-4 mt-3'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='name'>
                                Nombre
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="name"
                                type="name"
                                placeholder="Nombre Usuario"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.name && formik.errors.name ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.name}</p>
                                </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='surname'>
                                Apellido
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="surname"
                                type="surname"
                                placeholder="Apellido Usuario"
                                value={formik.values.surname}
                                onChange={formik.handleChange}
                            />
                        </div>

                        { formik.touched.surname && formik.errors.surname ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.surname}</p>
                                </div>
                        ) : null }

                        <div className='mb-4 mt-3'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="email"
                                type="email"
                                placeholder="Email Usuario"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>

                        { formik.touched.email && formik.errors.email ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.email}</p>
                                </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="password"
                                type="password"
                                placeholder="Password Usuario"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </div>

                        { formik.touched.password && formik.errors.password ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.password}</p>
                                </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='repeatPassword'>
                                Repetir Password
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="repeatPassword"
                                type="password"
                                placeholder="Repetir Password"
                                value={formik.values.repeatPassword}
                                onChange={formik.handleChange}
                            />
                        </div>

                        { formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.repeatPassword}</p>
                                </div>
                        ) : null }

                        <input 
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-800 text-white w-full mt-5 p-2 uppercase rounded-md font-bold shadow-lg"
                            value="Crear Cuenta"
                        />

                        <div className='text-center pt-5 '>
                            <Link href="/login">
                                <a className='text-gray-600 hover:text-purple-900 font-bold transition-all duration-300'>Iniciar sesión</a>
                            </Link>
                        </div>
                        
                    </form>
                </div>
            </div>
        </Layout>
    </>
  )
}

export default NewAccount