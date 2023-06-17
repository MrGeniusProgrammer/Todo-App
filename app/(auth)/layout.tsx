"use client"

import DarkModeToggle from '@/components/DarkModeToggle'
import React from 'react'

function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <div className='flex relative justify-center items-center h-screen w-screen'>
                {children}
                <div className='absolute bottom-0 right-0 m-4'>
                    <DarkModeToggle />
                </div>
            </div>
        </>
    )
}

export default Layout