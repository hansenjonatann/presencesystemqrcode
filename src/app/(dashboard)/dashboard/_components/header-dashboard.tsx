'use client'
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export default function HeaderDashboard () {
    const {data} : any = useSession()


    return (
        <Link href={'/dashboard/profile'} className="flex justify-end my-4 mx-12 items-center space-x-4 ">
            <div className="w-12 h-12 rounded-full border-2 border-accent bg-secondary">
                <Image src={data?.user?.profile ? data.user.profile : '' } width={50} height={50} alt={`${data?.user.name}`} className="w-full rounded-full object-cover"/>
            </div>
            <p className="font-bold">{data?.user.name}</p>
        </Link>
    )
}