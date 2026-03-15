import Forms from '@/components/custom/auth/Forms'
import React from 'react'

const page = async({searchParams}: any) => {
    const {verifyToken} =await searchParams
    console.log(verifyToken)
  return (
    <div className='w-full min-h-screen mx-auto 
    flex flex-col justify-center
    '><Forms verifyToken={verifyToken} /></div>
  )
}

export default page