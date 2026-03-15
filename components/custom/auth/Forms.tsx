"use client"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2Icon, Linkedin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { use, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { VerifyEmail, VerifyToken } from './verify-email'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const formSchema = z.object({
    email: z.email().min(3, 'Email is too short'),
    password: z.string().min(8, 'Password is too short'),
    first_name: z.string().min(3, 'First name is too short'),
    last_name: z.string().min(3, 'Last name is too short'),
    phone_number: z.string().min(3, 'Phone number is too short'),


})
const signInSchema = z.object({
    email: z.email().min(3, 'Email is too short'),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
})

const Forms = ({ verifyToken }:any) => {
    const [confirmCode, setConfirmCode] = useState(false)
    
    const router = useRouter()
    const path = usePathname()
    const isSignIn = path.includes('sign-in')
    const isSignUp = path.includes('sign-up')
    const isResetPassword = path.includes('reset-password')
    const isVerifyEmail = path.includes('verify-email')


    const form = useForm<z.infer<typeof formSchema | typeof signInSchema>>(
        {
            resolver: zodResolver(
                isSignIn ? signInSchema : formSchema
            ),
            defaultValues: {
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                phone_number: '',
            }
        }
    )

    const isLoading = form.formState.isSubmitting
    const supabase = createClient()


    const onsubmit = async (data: z.infer<typeof formSchema | typeof signInSchema>) => {

        if (isSignUp) {
            const { data: userInfo, error:err } = await supabase.from("user").select("*").eq("email", data.email)
            if (err) {
                console.log(err.message)
                toast.error(err.message)
            }
            console.log("user: ",userInfo);
            
            if (userInfo!.length>0) {
                toast.error('Email already exists')
            }
            const { data: user, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/verify-email`,
                    // captchaToken: data.captchaToken,
                    data: {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        phone_number: data.phone_number,
                        image: `https://avatar.iran.liara.run/username?username=${data.first_name}+${data.last_name}`,
                    }
                }
            })
            if (error) {
                console.log(error)
            } 

            const userData=user.user as User
             
            const { data: userCreate, error:createErr } = await supabase.from("user").insert([
                {
                    id: userData.id,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone: data.phone_number,
                    image: `https://avatar.iran.liara.run/username?username=${data.first_name}+${data.last_name}`,
                }
            ])
            if (createErr) {
                console.log(createErr)
                toast.error(createErr.message)
            }else {
                toast.success('User created successfully')
                setConfirmCode(true)
                // router.push('/auth/verify-email')
                console.log(user)
            }
        }
        else if (isSignIn) {
            const { data: user, error } = await supabase.auth.signInWithOtp({
                email: data.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/verify-email`,
                    data: {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        phone_number: data.phone_number,
                    }
                }
            })
            if (error) {
                console.log(error)
                
            } else {
                localStorage.setItem('email', data.email)
                router.push('/auth/sign-in?verifyToken=true')
                console.log(user)
            }
        }
    }



    const SignInWithLinkeInd = async () => {
        const supabase = createClient()
        supabase.auth.signInWithOAuth({
            provider: 'linkedin_oidc',
            options: {
                redirectTo: `${window.location.origin}/auth/verify-email`,
            },
        })
    }

    return (
        <div
            className="w-full max-w-2xl p-5 
    mx-auto
    "
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onsubmit)}
                    className='border-2 w-md p-5 rounded-md mx-auto
                    '
                >
                    {
                        isSignUp && !confirmCode&& <div className='flex flex-col gap-4 '>

                            <div className='flex items-center gap-4'>
                                <Button
                                    type='button'
                                    onClick={SignInWithLinkeInd}
                                >
                                    <Linkedin className='w-5 h-5' />
                                </Button>
                            </div>

                            <div className='flex justify-between items-center w-full gap-4'>
                                
                                <InputField form={form} label='First Name' placeholder='First Name' type='text' name='first_name' className="w-md" />
                                <InputField form={form} label='Last Name' placeholder='Last Name' type='text' name='last_name' className="w-md " />
                            </div>
                            <InputField form={form} label='Email' placeholder='Email' type='email' name='email' />
                            <InputField form={form} label='Password' placeholder='Password' type='password' name='password' />
                            <InputField form={form} label='+44 ' placeholder='phone number' type='text' name='phone_number' />
                            <Button
                                variant={"primary"}
                                type='submit'
                                className='w-full cursor-pointer'>Sign Up{isLoading && <Loader2 className='animate-spin' />}</Button>
                            <div className='flex justify-center  items-center flex-wrap w-full gap-4 mx-auto'>
                                <p>Already have an account? <Link href='/auth/sign-in'>Sign In</Link></p>

                            </div>
                        </div>
                    }
                    {
                        isSignUp && confirmCode && <Alert
                        className=''
                        >
                            <CheckCircle2Icon />
                            <AlertTitle>Success! Your account has been created</AlertTitle>
                            <AlertDescription>
                               Your account has been created successfully. Please check your email for the confirmation link.
                            </AlertDescription>
                            
                        </Alert>
                    }
                    {
                        isSignIn && !verifyToken&&<div className='flex flex-col gap-4 '>
                            <InputField form={form} label='Email' placeholder='Email' type='email' name='email' />
                            <Button
                                variant={"primary"}
                                type='submit' className='w-full cursor-pointer'>Sign In{isLoading && <Loader2 className='animate-spin' />}</Button>
                            <div className='flex justify-center items-center flex-wrap w-full gap-4 mx-auto'>
                                <p>Forgot your password? <Link href='/auth/reset-password'
                                    className='text-indigo-700 '
                                >Reset Password</Link></p>
                                <p>Don&apos;t have an account? <Link href='/auth/sign-up'
                                    className='text-indigo-700 '
                                >Sign Up
                                
                                </Link></p>

                            </div>
                        </div>
                       
                    }
                    {
                        isSignIn && verifyToken && <VerifyToken />
                    }

                </form>

            </Form>
        </div>
    )
}

export default Forms


interface SingInProps {
    form: any,
    label: string
    placeholder: string
    type: string
    name: string
    className?: string


}

const InputField = ({ form, className, label, placeholder, type, name }: SingInProps) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("", className)}>
                    <FormLabel>{label}</FormLabel>
                    <Input placeholder={placeholder} type={type}  {...field} />
                </FormItem>
            )}

        />
    )
}