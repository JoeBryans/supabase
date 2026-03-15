import { Button } from '@/components/ui/button'
import isLoggedIn from '@/lib/supabase/isLoggedIn'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
const Links = [
    {
        name: 'Ai visual assistant',
        href: '/dashboard/ai-visual-assistant',
        // icon:'Home'
    },
    {
        name: 'chatbot',
        href: '/dashboard/chatbot',
        // icon:'Info'
    }, {
        name: 'Courses',
        href: '/dashboard/courses',
        // icon:'Info'
    },


]
const NavBar = async() => {


    // console.log(pathName)
    const user = await isLoggedIn() as User
    // console.log(user)

    return (
        <div className={cn('w-full px-5 py-2 bg-gray-900 text-white',
        )}>
            <nav className='w-full max-w-7xl mx-auto flex justify-between items-center'>
                <ul
                    className='flex items-center gap-4 '
                >
                    <li className='text-xl font-bold'>
                        <Link href='/' className='text-indigo-700'> Bryan </Link>
                    </li>

                    {
                        Links.map((link, index) => {
                            return (

                                <li key={index}> <Link href={link.href}>{link.name}</Link></li>

                            )
                        })
                    } </ul>

                <ul>
                    {
                        user !==null ? <li className='flex gap-4 items-center'>
                            <Link href='/dashboard'>
                            <Button variant={"secondary"}>
                                    Dashboard
                                </Button>
                            </Link>
                            {/* <Link href='/auth/sign-in'>Sign Out</Link> */}
                            <Image
                                src={user.user_metadata.image.trim()}
                                alt="user"
                                width={300}
                                height={300}
                                className='w-10 h-10 rounded-full'
                            />
                        </li>
                            : <li className='flex gap-4 items-center'><Link href='/auth/sign-in'>
                                <Button variant={"primary"}>
                                    Sign In
                                </Button>
                            </Link>
                                <Link href='/auth/sign-up'>
                                    <Button variant={"primary"}>
                                        Sign Up
                                    </Button></Link></li>

                    }
                </ul>
            </nav>
        </div>
    )
}

export default NavBar