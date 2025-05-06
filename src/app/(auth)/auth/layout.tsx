'use client'
import type React from "react";
import {Toaster} from 'react-hot-toast'

export default function AuthLayout ({children} : {children: React.ReactNode}) {
    return (
        <div className="bg-primary md:h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 ">
                <Toaster position="top-right"/>
                {children}
            </div>
            <div className="h-full">
                
            </div>
        </div>
    )
}