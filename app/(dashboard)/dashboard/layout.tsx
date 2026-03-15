import SideBar from '@/components/custom/dashboard/SideBar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex gap-4 w-full min-h-screen bg-gray-100'>
        <div className='w-60'>
            <SideBar/>
        </div>

        <main className='flex-1'>{children}</main>
    </div>
  )
}

export default layout