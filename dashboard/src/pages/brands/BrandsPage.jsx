import React from 'react'
import { Tag, Plus, Info } from 'lucide-react'
import { useGetDistinctBrandsQuery } from '../../features/products/productsApi.js'
import Spinner from '../../components/common/Spinner.jsx'

export const BrandsPage = () => {
  const { data: brandsRes, isLoading } = useGetDistinctBrandsQuery()
  const brands = brandsRes?.data || []

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
          <p className="text-slate-500 text-sm mt-1">Manage brand listings and partnerships.</p>
        </div>
      </div>
      
      {/* Info Alert */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start">
        <Info className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm text-indigo-900">
          Brands are dynamically extracted from your active products. To add a new brand, simply type it when adding or editing a product.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : brands.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200 border-dashed min-h-[400px]">
          <div className="text-center max-w-sm px-6 py-10">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Tag size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No Brands found</h3>
            <p className="text-sm text-slate-500 mb-6">
              Add products with brand names to see them listed here.
            </p>
          </div>
        </div>
      ) : (
        /* Brands Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div key={brand.name} className="bg-white rounded-xl border border-slate-200 p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                <Tag className="text-slate-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{brand.name}</h3>
                <p className="text-sm text-slate-500">{brand.count} Product{brand.count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrandsPage
