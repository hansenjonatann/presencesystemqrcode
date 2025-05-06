import HeaderDashboard from "./_components/header-dashboard";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout ( {children} : {children: React.ReactNode}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6">
            <div className="col-span-1">
                <Sidebar/>
            </div>
            <div className="col-span-5">
                    <HeaderDashboard/>
                    <div className="m-4">
                    {children}
                    </div>
            </div>
        </div>
    )
}