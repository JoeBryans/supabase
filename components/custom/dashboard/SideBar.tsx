"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
const Links = [
    {
        name: 'Courses',
        href: '/dashboard/courses',
        // icon:'Info'
    },
    {
        name: 'chatbot',
        href: '/dashboard/chatbot',
        // icon:'Info'
    }, {
        name: 'Ai visual assistant',
        href: '/dashboard/ai-visual-assistant',
        // icon:'Home'
    },


]
const SideBar = () => {
    return (
        <div className='bg-gray-900 h-full text-gray-50'>
            <nav className='w-full max-w-7xl mx-auto flex flex-col  items-start gap-8'>
                <Link href='/' className='text-indigo-700 w-full text-center text-2xl font-black'> Bryan </Link>
                <ul
                    className='flex flex-col items-start gap-4 px-2 md:px-5 '
                >
                    {
                        Links.map((link, index) => {
                            return (

                                <li key={index}
                                    className='border-2 border-gray-300 p-2 rounded-lg bg-gray-300 text-gray-700 font-black '
                                > <Link href={link.href}>{link.name}</Link></li>

                            )
                        })
                    } </ul>


            </nav>
        </div>
    )
}

export default SideBar