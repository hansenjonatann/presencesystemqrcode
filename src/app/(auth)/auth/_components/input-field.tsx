'use client'

interface InputFieldProps {
    placeholder?: string 
    type: 'text' | 'number' | 'password'  |'email' | 'file'
    onchange: (e: any) => void
    isrequired: boolean 
}

export default function InputField ({placeholder , type , onchange , isrequired} : InputFieldProps) {
    return (
        <input type={type} onChange={onchange} className="w-full p-2 rounded-lg text-accent placeholder:text-accent  border-1 border-third  shadow-lg" placeholder={placeholder} required={isrequired}  />
    )
}