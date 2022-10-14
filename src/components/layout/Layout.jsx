import React from 'react'
import { Header } from '@/components/header'

const Layout = ({children}) => {
    return (
        <>
            <div className='flex flex-col items-center justify-center text-center'>
                <Header />
                {children}
            </div>
        </>
    )
}

export default Layout