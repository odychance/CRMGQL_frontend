import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
      name
      surname
      company
      email
      telephone
    }
  }
`

const UPDATE_CLIENT = gql`
    mutation updateClient($id: ID!, $input: ClientInput) {
        updateClient(id: $id, input: $input) {
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
            name
            surname
            company
            email
        }
    }
`

const EditClient = () => {
  
  //Obtener el id actual
  const router = useRouter()
  const { query : { id } } = router
  // console.log(id)
  
  //Consultar para obtener el cliente
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id
    }
  })

  //Actualizar el cliente
  const [ updateClient ] = useMutation( UPDATE_CLIENT, {
      update(cache, { data: { updateClient } } ) {
          //Actualizar clientes
          const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_SELLER })
      
          //actualizamos el cache
          const updatedClients = getClientsSeller.map( client => 
              client.id === id ? updateClient : client
            )
    
            cache.writeQuery({
                query : GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller: updatedClients
                }
            })
    
            //Actualizar el cliente Actual
            cache.writeQuery({
                query: GET_CLIENT,
                variables: { id },
                data: {
                    getClient: updateClient
                }
            })
        }

    } )



    
  // Schema de validacion
  const schemaValidation = Yup.object({
    name: Yup.string()
    .required('El nombre del cliente es obligatorio'),
    surname: Yup.string()
    .required('El apellido del cliente es obligatorio'),
    company: Yup.string()
    .required('El campo empresa es obligatorio'),
    email: Yup.string()
    .email('Email no valido')
    .required('El apellido del cliente es obligatorio'),
  })
  
  if(loading) return null

  // console.log(data.getClient)

  const { getClient } = data

  //Modifica el cliente en la DB
  const updateInfoClient = async values => {
    const { name, surname, company, email, telephone } = values

    try {
        const { data } = await updateClient({
            variables: {
                id,
                input: {
                    name,
                    surname,
                    company,
                    email,
                    telephone
                }
            }
        })
        console.log(data)

        //Mostrar Alerta

        Swal.fire(
            'ACTUALIZADO!',
            'El cliente se actualizo correctamente',
            'success'
          )
        //Redireccionar
        router.push('/')
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Layout>
    <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Editar Cliente</h1>

    <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
            <Formik
              validationSchema={ schemaValidation }
              enableReinitialize
              initialValues={ getClient }
              onSubmit={ ( values, fnc) => {
                updateInfoClient(values)
                // console.log(fnc)
              }}
            >
            
              {props => {
                // console.log(props)
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
                              placeholder="Nombre Cliente"
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
                              htmlFor='surname'
                          >
                              Apellido
                          </label>

                          <input
                              className='shadow border rounded appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                              id='surname'
                              type='text'
                              placeholder="Apellido Cliente"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.surname}
                      />
                      </div>

                      { props.touched.surname && props.errors.surname ? (
                          <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                              <p className='font-bold text-center'>{props.errors.surname}</p>
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
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.company}
                      />
                      </div>

                      { props.touched.company && props.errors.company ? (
                          <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                              <p className='font-bold text-center'>{props.errors.company}</p>
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
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.email}
                      />
                      </div>

                      { props.touched.email && props.errors.email ? (
                          <div className='my-4 bg-red-300 border-4 border-red-500 text-red-700 p-4 rounded-lg'>
                              <p className='font-bold text-center'>{props.errors.email}</p>
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
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.telephone}
                      />
                      </div>

                      <input
                          type="submit"
                          className='bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg uppercase mt-5 p-2 text-white font-bold  w-full shadow-xl'
                          value="Editar Cliente"

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

export default EditClient