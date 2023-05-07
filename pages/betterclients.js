import React, { useEffect} from 'react'
import Layout from '../components/Layout'
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const BETTER_CLIENTS = gql`
    query betterClients {
        betterClients {
            total
            client {
                name
                company
            }
            }
    }
`

const betterclients = () => {


    const {data, loading, error, startPolling, stopPolling} = useQuery(BETTER_CLIENTS)

    
    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling() 
        }
    }, [startPolling, stopPolling])
    
    if(loading) return 'cargando'
    
    console.log(data)
    
    const { betterClients } = data
    const ClientGraphic = []

    betterClients.map((client, index) => {
        ClientGraphic[index] = {
            ...client.client[0],
            total: client.total
        }
    })




    const data2 = [
        { name: "hola", total: 900},
        { name: "adios", total: 100},
    ]

  return (
      <Layout>
            <h1 className='text-2xl text-purple-800 font-bold hover:text-purple-700 transition-all duration-300'>Mejores Clientes</h1>
      
            <ResponsiveContainer width="80%" height="80%">
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={ClientGraphic}
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

export default betterclients