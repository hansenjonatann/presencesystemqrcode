'use client'
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import InputField from "../_components/input-field";

import { signIn } from "next-auth/react";


export default function AuthSignInPage () {
    const [username , setUsername] = useState<string>('')
    const [password , setPassword] = useState<string>('')
    const [loading , setLoading] = useState<boolean>(false)
    const router = useRouter()
    const pathname = usePathname()

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await signIn('credentials' , {username , password , redirect: false} ).then(() => {
            setLoading(false)
            router.push('/dashboard')
            toast.success(`Welcome back , ${username}`)
        }).catch((err) => {
            setLoading(false)
            toast.error(`${err}`)
        })
    }


    
    return (
       <div className="mt-4 text-accent ">
        <h1 className="text-center text-3xl font-bold">Presence System Qr Based</h1>
        <div className="mt-32">
        <form  onSubmit={handleSignIn} className="mx-8">
            <h1 className="text-center text-2xl font-bold">Welcome Back</h1>
            <p className="text-center mt-2 text-gray-500">Please enter your details to entering the system!</p>
            <div className="mt-4 flex bg-accent rounded-xl items-center w-[200px] p-2 mx-auto justify-center space-x-3">
                <Link className={pathname == '/auth/sign-in' ? "  bg-primary font-bold w-1/2  px-4 py-2 rounded-lg  " : " rounded-lg  "} href={'/auth/sign-in'}>Sign In</Link>
                <Link className=" rounded-lg text-primary " href={'/auth/sign-up'}>Sign Up</Link>
            </div>

            <div className="m-8 flex flex-col space-y-3">
               <InputField placeholder="Username" isrequired={true} onchange={(e) => setUsername(e.target.value)} type='text'/>
               <InputField placeholder="Password" isrequired={true} onchange={(e) => setPassword(e.target.value)} type='password'/>
            <button className="w-full p-2 rounded-lg shadow-xl bg-secondary text-accent font-bold">{loading ? <div className="flex justify-center  space-x-2 items-center">
                <Loader2 className="animate-spin"/>
                <p className="text-sm font-bold">Loading...</p> 
            </div> : 'Sign In'}</button>
            </div>

        </form>
        </div>
            

       </div>
    )
}