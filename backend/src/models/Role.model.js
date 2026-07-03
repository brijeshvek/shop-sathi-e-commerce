import mongoose from 'mongoose'

const permissionSchema = new mongoose.Schema({
    canViewProducts: { type: Boolean, default: true },
    canManageProducts: { type: Boolean, default: true },
    canDeleteProducts: { type: Boolean, default: false },
    canViewOrders: { type: Boolean, default: true },
    canUpdateOrderStatus: { type: Boolean, default: false },
}, { _id: false })

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    permissions: {
        type: permissionSchema,
        default: () => ({}),
    },
}, { timestamps: true })

const Role = mongoose.model('Role', roleSchema)
export default Role