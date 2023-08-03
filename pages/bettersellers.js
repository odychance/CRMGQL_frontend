import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const BETTER_SELLERS = gql`
    query BetterSellers {
        betterSellers {
            total
            seller {
                name
                email
            }
        }
    }
`
  
const Bettersellers = () => {


    const {data, loading, error, startPolling, stopPolling} = useQuery(BETTER_SELLERS)

    
    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling() 
        }
    }, [startPolling, stopPolling])
    
    if(loading) return 'cargando'
    
    console.log(data)
    
    const { betterSellers } = data
    const SellerGraphic = []


    betterSellers.map((seller, index) => {
        SellerGraphic[index] = {
            ...seller.seller[0],
            total: seller.total
        }
    })

    return (
        <Layout>
            <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Mejores Vendedores</h1>
            <ResponsiveContainer width="80%" height="80%">
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={SellerGraphic}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="rgb(107 33 168)" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    )
}

export default Bettersellers