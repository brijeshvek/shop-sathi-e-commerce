import React, { useState, useEffect } from 'react'
// PageHeader removed because it does not exist
import { UserCog, Save } from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import { useGetRolePermissionsQuery, useUpdateRolePermissionsMutation } from '../../features/roles/rolesApi.js'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner.jsx'

const PermissionToggle = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0">
        <div>
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-slate-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
        </label>
    </div>
)

const RolePermissionsPage = () => {
    const { data: resData, isLoading } = useGetRolePermissionsQuery('seller')
    const [updatePermissions, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation()

    const [permissions, setPermissions] = useState({
        canViewProducts: true,
        canManageProducts: true,
        canDeleteProducts: false,
        canViewOrders: true,
        canUpdateOrderStatus: false,
    })

    useEffect(() => {
        if (resData?.data) {
            setPermissions(resData.data)
        }
    }, [resData])

    const handleToggle = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSaveChanges = async () => {
        try {
            await updatePermissions({ roleName: 'seller', permissions }).unwrap()
            toast.success('Permissions updated successfully!')
        } catch (error) {
            toast.error('Failed to update permissions.')
            console.error(error)
        }
    }

    if (isLoading) {
        return (
            <div className="page-container flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <UserCog size={24} /> Role Permissions
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage what different roles can access.</p>
            </div>
            <div className="page-content">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="p-4 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800">Seller Role</h3>
                        <p className="text-sm text-slate-500">Define what sellers can see and do in their dashboard.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <PermissionToggle label="View Products" description="Allow seller to see their product list." enabled={permissions.canViewProducts} onChange={() => handleToggle('canViewProducts')} />
                        <PermissionToggle label="Create/Edit Products" description="Allow seller to add and modify their products." enabled={permissions.canManageProducts} onChange={() => handleToggle('canManageProducts')} />
                        <PermissionToggle label="Delete Products" description="Allow seller to delete their own products." enabled={permissions.canDeleteProducts} onChange={() => handleToggle('canDeleteProducts')} />
                        <PermissionToggle label="View Orders" description="Allow seller to see orders containing their products." enabled={permissions.canViewOrders} onChange={() => handleToggle('canViewOrders')} />
                        <PermissionToggle label="Update Order Status" description="Allow seller to change the status of their orders (e.g., 'shipped')." enabled={permissions.canUpdateOrderStatus} onChange={() => handleToggle('canUpdateOrderStatus')} />
                    </div>
                    <div className="p-4 bg-slate-50/50 flex justify-end">
                        <Button variant="primary" icon={Save} onClick={handleSaveChanges} disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RolePermissionsPage