import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'


const Header = () => {

    const router = useRouter()

    const logout = () => {
        localStorage.removeItem('token')
        router.push('/login')
        return null
    }

  return (
    <div className='flex sm:justify-end pb-10 lg:pb-0 md:pb-0 sm:pb-0'>
        { router.pathname === '/' ? (
            <Link href="/newclient">
                <a className='text-center bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg w-full text-xs uppercase px-4 py-2 text-white font-bold  sm:w-auto shadow-xl mr-4'>
                    Nuevo Cliente
                </a>
            </Link>
            ) : null
        }

        { router.pathname === '/products' ? (
            <Link href="/newproduct">
                <a className='text-center w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg text-xs uppercase px-4 py-2 text-white font-bold sm:w-auto shadow-xl mr-4'>
                    Nuevo Producto
                </a>
            </Link>
            ) : null
        }

        { router.pathname === '/orders' ? (
            <Link href="/neworder">
                <a className='text-center w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 rounded-lg text-xs uppercase px-4 py-2 text-white font-bold sm:w-auto shadow-xl mr-4'>
                    Nuevo Pedido
                </a>
            </Link>
            ) : null
        }
        
        <button
            type='button'
            className='bg-purple-700 w-full hover:bg-purple-800 transition-all duration-300 rounded-lg text-xs uppercase px-4 py-2 text-white font-bold sm:w-auto shadow-xl'
            onClick={() => logout()}
        >  
            Cerrar Sesión
        </button>

    </div>
)
}

export default Header