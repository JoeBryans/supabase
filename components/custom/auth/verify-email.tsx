"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const VerifyEmail = () => {
  return (
    <div className='block space-y-2 w-full max-w-md mx-auto border-2 border-gray-300 rounded-md p-5'>
      <Label>
        <span>Youur Email is successfully verified</span>
      </Label>

      <Link href='/dashboard'>
        <Button
          variant={"primary"}
          type='button'
          className='w-full cursor-pointer'

        >Back to Dashboard</Button></Link>
    </div>
  )
}

export const VerifyToken = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const email = localStorage.getItem('email')

  const supabase = createClient()
  const verifyToken = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: code,
      type: 'email',
    })
    if (error) {
      setLoading(false)
      setError(error.message)
    } else {
      setError('')
      setLoading(false)
      localStorage.removeItem('email')
      setLoading(false)
      router.push('/dashboard')
    }
  }
  return (
    <div className='block space-y-2 w-full max-w-md mx-auto '>
      {error && <p className='text-red-500 bg-red-100 p-2 rounded-md'>{error}</p>}
      <Label>
        <span>Verify Code for your sign in </span>
      </Label>
      <Input placeholder='entery your verification code' type='text' name='code'
        value={code}
        onChange={(e) => {
          setCode(e.target.value)
        }}
      />
      <Button
        variant={"primary"}
        type='button'
        className='w-full cursor-pointer'
        onClick={verifyToken}
        disabled={loading}
      >verify
        {
          loading && <Loader2 className='animate-spin' />
        }
      </Button>
    </div>
  )
}

