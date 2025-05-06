'use client'

import {  BriefcaseBusinessIcon, ClipboardList, Clock, LayoutDashboard, User, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar () {

    const {data}: any = useSession()
    const pathname = usePathname()

    const role = data?.user?.role || 'STAFF'

    const staffList = [
        {
            label: 'Permission',
            icon: ClipboardList,
            path: '/dashboard/permission'
        },

        {
            label: 'Presence',
            icon: Clock,
            path: '/dashboard/presence'
        }
    ]

    const adminList = [
        {
            label: 'User' , 
            icon: User,
            path: '/dashboard/user'
        },
        {
            label: 'Staff' , 
            icon: Users,
            path: '/dashboard/staff'
        },
        {
            label: 'Job' , 
            icon: BriefcaseBusinessIcon,
            path: '/dashboard/job'
        },
        {
            label: 'Permission',
            icon: ClipboardList,
            path: '/dashboard/permission'
        }
    ]

    const hrList = [
     
        {
            label: 'Staff' , 
            icon: Users,
            path: '/dashboard/staff'
        },
        {
            label: 'Permissions',
            icon: ClipboardList,
            path: '/dashboard/permission'
        }
    ]
    return (
        <aside className=" hidden md:flex md:flex-col bg-secondary w-full md:h-screen ">
            <h1 className="mx-auto font-bold text-xl mt-8">{role} Dashboard</h1>
            <div className="mx-4 mt-8">
            <Link className={pathname == '/dashboard' ? " bg-accent rounded-lg text-secondary p-2 flex space-x-4 items-center" : "flex space-x-4 items-center"} href={'/dashboard'}>
                <LayoutDashboard/>
                <p className="font-bold">Dashboard</p>

            </Link>
            </div>
            <div className="m-4 mt-8 flex flex-col space-y-6">
                {role == 'ADMIN' ? adminList.map((adm: any , idx: number) => (
                    <Link key={idx} href={adm.path} className={pathname == adm.path ? " bg-accent rounded-lg text-secondary  p-2 flex space-x-4 items-center" : "flex space-x-4 hover:bg-accent/30 hover:p-2 hover:rounded-md hover:shadow-lg  transition-all duration-500 ease-in-out items-center"}>
                        <adm.icon/>
                        <p className="font-bold text-xl">{adm.label}</p>
                    </Link>
                )) : role == 'HR' ? hrList.map((hr: any , idx: number) => (
                    <Link key={idx} href={hr.path} className={pathname == hr.path ? " bg-accent rounded-lg text-secondary  p-2 flex space-x-4 items-center" : "flex space-x-4 hover:bg-accent/30 hover:p-2 hover:rounded-md hover:shadow-lg  transition-all duration-500 ease-in-out items-center"}>
                    <hr.icon />
                    <p className="font-bold">{hr.label}</p>
                </Link>
                )) : staffList.map((staff:any , idx: number) => (
                    <Link key={idx} href={staff.path} className={pathname == staff.path ? " bg-accent rounded-lg text-secondary  p-2 flex space-x-4 items-center" : "flex space-x-4 hover:bg-accent/30 hover:p-2 hover:rounded-md hover:shadow-lg  transition-all duration-500 ease-in-out items-center"}>
                    <staff.icon/>
                    <p className="font-bold">{staff.label}</p>
                </Link>
                ))  } 
            </div>
        </aside>
    )


}