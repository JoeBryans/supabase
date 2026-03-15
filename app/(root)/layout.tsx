import NavBar from '@/components/custom/header/NavBar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
          <NavBar />
        <main>{children}</main>
    </div>
  )
}

export default layout