"use client";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function DashboardPermission() {
  const [page, setPage] = useState<number>(1);
  const { data, status }: any = useSession();
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleModal = () => setIsModal((prev) => !prev);
  const handleActionToggle = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  const role = data?.user?.role || "STAFF";

  const { data: permissions = [], refetch } = api.permission.get.useQuery(
    { page },
    {
      enabled: status === "authenticated",
    },
  );

  const approveMutation = api.permission.approvePermission.useMutation({
    onSuccess: ()=> {
        toast.success('Permission approved!')
        refetch()
        
    }
  } )
  const declineMutation = api.permission.declinePermission.useMutation({
    onSuccess: ()=> {
        toast.success('Permission declined!')
        refetch()
        
    }
  } )

  const handleApprovePermission = (id: string) => approveMutation.mutate({id})
  const handleDeclinePermission = (id: string) => declineMutation.mutate({id})

  const { data: allpermissions = [] } = api.permission.getAll.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    },
  );

  const createPermissionMutation = api.permission.create.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast.success("Create a new permission success!");
      toggleModal();
      refetch();
    },
    onError: (e) => {
      setLoading(false);
      toast.error(e.message);
    },
  });

  const handleApplyPermission = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    createPermissionMutation.mutate({ reason });
  };

  const renderStatusBadge = (status: string) => {
    const baseClass =
      "m-4 text-center w-[100px] rounded-xl px-2 py-1 text-accent";
    if (status === "APPROVE") return <div className={`bg-accept ${baseClass}`}>{status}</div>;
    if (status === "DECLINE") return <div className={`bg-failed ${baseClass}`}>{status}</div>;
    return <div className={`bg-warning ${baseClass}`}>{status}</div>;
  };

  const renderPermissionRow = (item: any, idx: number) => (
    <tr key={idx}>
      <td className="border-b p-2 text-center">{idx + 1}</td>

      {(role === "ADMIN" || role === "HR") && (
        <td className="border-b p-2 text-center">{item.user?.name || "-"}</td>
      )}

      <td className="border-b p-2 text-center">
        {item.submissionDate.toLocaleDateString("id-ID").replaceAll("/", "-")}
      </td>

      <td className="border-b p-2 text-center">{item.reason}</td>

      <td className="border-b p-2 text-center">
        <div className="relative flex justify-center items-center">
          {renderStatusBadge(item.status)}
          {(role === "ADMIN" || role === "HR") && (
            <>
              <button
                onClick={() => handleActionToggle(item.id)}
                className="ml-2"
              >
                <EllipsisVertical />
              </button>
              {selectedId === item.id && (
                <div className="absolute top-10 z-10 w-[120px] rounded-md bg-secondary shadow-lg border">
                  <button onClick={() => handleApprovePermission(item.id)} className="block w-full px-4 py-2 hover:bg-secondary/60 text-left text-sm">
                    Approve
                  </button>
                  <button onClick={() => handleDeclinePermission(item.id)} className="block w-full px-4 py-2 hover:bg-secondary/60 text-left text-sm">
                    Decline
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const displayList = role === "ADMIN" ? allpermissions : permissions;

  return (
    <>
      <h1 className="text-xl font-bold">Permission</h1>

      {role === "STAFF" && (
        <button
          onClick={toggleModal}
          className="mt-8 rounded-lg bg-sky-600 p-2 text-white"
        >
          Add new permit application
        </button>
      )}

      <table className="mt-8 w-full table-auto">
        <thead className="bg-secondary/90 rounded-md">
          <tr className="text-accent">
            <td className="p-2 text-center">#</td>
            {(role === "ADMIN" || role === "HR") && (
              <td className="p-2 text-center">Staff</td>
            )}
            <td className="p-2 text-center">Date</td>
            <td className="p-2 text-center">Reason</td>
            <td className="p-2 text-center">Status</td>
          </tr>
        </thead>
        <tbody>
          {displayList.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-failed font-bold">
                No Permission
              </td>
            </tr>
          ) : (
            displayList.map(renderPermissionRow)
          )}
        </tbody>
      </table>

      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-secondary w-[400px] rounded-lg p-6 shadow-lg">
            <h2 className="text-accent mb-4 text-lg font-semibold">
              Apply for Permission
            </h2>
            <form onSubmit={handleApplyPermission}>
              <div className="mb-4">
                <label
                  htmlFor="reason"
                  className="text-accent mb-1 block text-sm font-medium"
                >
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-accent w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                  rows={4}
                  placeholder="Enter your reason for permission..."
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-failed text-accent hover:bg-failed/40 rounded-md px-4 py-2 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-4 py-2 text-white transition-colors hover:bg-sky-700 disabled:bg-sky-400"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
