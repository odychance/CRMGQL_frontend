import React from 'react'
import Sidebar from './Sidebar'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from './Header'

const Layout = ({children}) => {

    //Hook de router
    const router = useRouter()

  return (
    <>
        <Head>
            <title>CRM - Administracion de clientes</title>
            {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" crossorigin="anonymous" referrerpolicy="no-referrer" /> */}
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
        </Head>

        {router.pathname === "/login" || router.pathname === "/newaccount" ? (
            <div className="bg-purple-900 min-h-screen flex flex-col justify-center">
                <div>
                    {children}
                </div>
            </div>
        ) : (
        <> 
            <div className='bg-gray-200 min-h-screen'>
                <div className='sm:flex min-h-screen'>
                    <Sidebar />
                
                    <main className='sm:w-2/3 m:w-3/4 xl:w-4/5 sm:min-h-screen p-5'>
                        <Header/>
                        {children}
                    </main>
                </div>
            </div>
        </>

        )}
    </>
  )
}

export default Layout