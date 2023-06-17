import React from 'react'

export const metadata = {
    title: 'Login',
    description: '',
}

function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            {children}
        </>
    )
}

export default Layout;