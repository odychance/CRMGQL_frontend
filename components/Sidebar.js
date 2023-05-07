import React, { Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery, gql  } from '@apollo/client'


const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            surname
        }
    }
`


const Sidebar = () => {
    
    //Query de apollo
    const { data, loading, error } = useQuery(GET_USER)

    //routing de next
    const router = useRouter();

    //Proteger que no acceda a data antes de tener resultados
    if(loading) return null

    //Si no hay informacion
    if(!data) {
        return router.push('/login')
    }
    
    const { name, surname } = data.getUser

    // console.log(router.pathname)

  return (
    <aside className='flex flex-col justify-between bg-purple-900 sm:w-1/3 m:w-1/4 xl:w-1/5 sm:min-h-screen p-5'>

        <div>
            <div>
                <p className='text-white hover:text-gray-300 text-2xl font-black text-center justify-content transition-all duration-300'>CRM Clientes</p>
            </div>

            <nav className='mt-10 list-none'>
                <li className={router.pathname === "/" ? "bg-purple-700 hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3" : "hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3"}>
                    <Link href="/">
                        <a className='text-white hover:text-purple-200 transition-all duration-300 font-bold text-l block'>
                            Clientes
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/orders" ? "bg-purple-700 hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3" : "hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3"}>
                    <Link href="/orders">
                        <a className='text-white hover:text-purple-200 transition-all duration-300 font-bold text-l block'>
                            Pedidos
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/products" ? "bg-purple-700 p-3 hover:bg-purple-600 transition-all duration-300 rounded-md " : "hover:bg-purple-600 transition-all duration-300 p-3 rounded-md"}>
                    <Link href="/products">
                        <a className='text-white hover:text-purple-200 transition-all duration-300 font-bold text-l block'>
                            Productos
                        </a>
                    </Link>
                </li>
            </nav>
            <div>
                <p className='text-white hover:text-gray-300 text-2xl font-black text-center justify-content transition-all duration-300 mt-10'>Otras Opciones</p>
            </div>


            <nav className='mt-10 list-none'>
                <li className={router.pathname === "/bettersellers" ? "bg-purple-700 p-3 hover:bg-purple-600 transition-all duration-300 rounded-md mb-3" : "hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3"}>
                    <Link href="/bettersellers">
                        <a className='text-white hover:text-purple-200 transition-all duration-300 font-bold text-l block'>
                            Mejores Vendedores
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/betterclients" ? "bg-purple-700 p-3 hover:bg-purple-600 transition-all duration-300 rounded-md mb-3" : "hover:bg-purple-600 transition-all duration-300 p-3 rounded-md mb-3"}>
                    <Link href="/betterclients">
                        <a className='text-white hover:text-purple-200 transition-all duration-300 font-bold text-l block'>
                            Mejores Clientes
                        </a>
                    </Link>
                </li>

            </nav>
        </div>

        <p className='capitalize text-xl text-white hover:text-purple-300 transition-all duration-500 font-bold text-center border-b-4 border-purple-500'> Hola: {name} {surname} </p>

    </aside>
  )
}

export default Sidebar