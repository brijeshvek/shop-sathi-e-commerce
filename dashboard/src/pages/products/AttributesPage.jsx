import React from 'react'
import { List, Plus } from 'lucide-react'
import Button from '../../components/common/Button.jsx'

export const AttributesPage = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attributes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage product attributes and variations.</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add New
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200 border-dashed min-h-[400px]">
        <div className="text-center max-w-sm px-6 py-10">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <List size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Attributes found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Get started by creating your first entry. Detailed analytics and management tools will appear here.
          </p>
          <Button variant="secondary" icon={Plus} className="mx-auto">
            Create Attributes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AttributesPage
