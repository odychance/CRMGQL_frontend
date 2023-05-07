import React from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: AuthenticateInput) {
        authenticateUser(input: $input) {
            token
        }
    }
`

const Login = () => {

    const router = useRouter()

    const [ message, setMessage ] = useState(null)

    //mutation para crear nuevos usuarios en apollo
    const [ authenticateUser ] = useMutation(AUTHENTICATE_USER)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                        .email('El email no es valido')
                        .required('El email es obligatorio'),
            password: Yup.string()
                        .required('El password es obligatorio')
        }),
        onSubmit: async values => {

            const { email, password } = values

            try {
                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                // console.log(data)
                //Si pasa la validacion
                setMessage('Autentiando...')

                //guardar token en localstorage
                setTimeout(() => {
                    const { token } = data.authenticateUser
                    localStorage.setItem('token', token)
                }, 1000);

                //Redireccionar al cliente
                setTimeout(() => {
                    setMessage(null)
                    router.push('/')
                }, 2000);

            } catch (error) {
                
                setMessage(error.message)
                setTimeout(() => {
                    setMessage(null)
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
    <>
        <Layout>
            <h1 className='text-center text-2xl text-white font-black hover:text-purple-300'>Login</h1>

            { message && showMessage() }

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form
                        className='bg-purple-300 rounded-md shadow-md px-8 pt-6 pb-8 mb-4 '
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4 mt-3'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="email"
                                type="email"
                                placeholder="Email Usuario"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />

                            { formik.touched.email && formik.errors.email ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.email}</p>
                                </div>
                            ) : null }
                            
                        </div>
                        <div className='mb-4'>
                            <label className='block text-purple-700 hover:text-purple-900 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='pl-2 bg-white  shadow appearance-none border rounded-md w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="password"
                                type="password"
                                placeholder="Password Usuario"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />

                            { formik.touched.password && formik.errors.password ? (
                                <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                                    <p className='font-bold text-center'>{formik.errors.password}</p>
                                </div>
                            ) : null }

                        </div>
                        <input 
                            type="submit"
                            className="transition-all duration-300 bg-purple-600 hover:bg-purple-800 text-white w-full mt-5 p-2 uppercase rounded-md font-bold shadow-lg"
                            value="Iniciar Sesión"
                        />

                        <div className='text-center pt-5 '>
                            <Link href="/newaccount">
                                <a className='text-gray-600 hover:text-purple-900 font-bold transition-all duration-300'>Crear un usuario</a>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    </>
  )
}

export default Login