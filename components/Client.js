import React from 'react'
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router'

const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!) {
        deleteClient(id: $id)
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

const Client = ({ client }) => {

    //Mutation para eiminar cliente
    const [ deleteClient ] = useMutation(DELETE_CLIENT, {
        update(cache) {
            //obtener una copia del objeto de cache
            const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_SELLER })

            //Reescribir el cache
            cache.writeQuery({
                query: GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller : getClientsSeller.filter( currentClient => currentClient.id !== id)
                }
            })
        }
    })

    const { name, surname, company, email, telephone, id } = client

    //Eliminar un cliente
    const confirmDeleteClient = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este cliente?',
            text: "No podras revertir eta accion una vez aceptada!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6b21a8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar!'
          }).then( async (result) => {
            if (result.isConfirmed) {

                try {
                    //Eliminar por ID
                    const { data } = await deleteClient({
                        variables: {
                            id
                        }
                    })
                    // console.log(data)

                    //Mostrar una alerta
                    Swal.fire(
                      'Eliminado!',
                      data.deleteClient,
                      'success'
                    )
                } catch (error) {
                  console.log(error)        
                }
            } else if (!result.isConfirmed){
                Swal.fire(
                    'Cancelado',
                    'Haz cancelado la acción',
                    'error'
                )        
            }
          })
    }

    const editClient = () => {
        Router.push({
            pathname: "/editclient/[id]",
            query: { id }
        })
    }

  return (
    <tr>
    <td className='border px-4 py-2'>{name} {surname}</td>
    <td className='border px-4 py-2'>{company}</td>
    <td className='border px-4 py-2'>{email}</td>
    <td className='border px-4 py-2'>
        <button
            className='flex justify-center items-center w-full bg-red-600 hover:bg-red-700 transitio-all duration-300 text-white rounded-lg uppercase font-bold shadow-sm py-2 px-4 text-xs'
            type='button'
            onClick={() => confirmDeleteClient() }
        >
            Eliminar
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
        </button>
    </td>
    <td className='border px-4 py-2'>
        <button
            className='flex justify-center items-center w-full bg-green-600 hover:bg-green-700 transitio-all duration-300 text-white rounded-lg uppercase font-bold shadow-sm py-2 px-4 text-xs'
            type='button'
            onClick={() => editClient() }
        >
            Editar
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        </button>
    </td>
  </tr>
)
}

export default Client