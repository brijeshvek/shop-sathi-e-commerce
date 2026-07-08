import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Check, X, Megaphone, Image as ImageIcon, Link as LinkIcon, Tag } from 'lucide-react'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import Badge from '../../components/common/Badge.jsx'
import Spinner from '../../components/common/Spinner.jsx'

export const BannersPage = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  
  // Form states
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState('')
  const [link, setLink] = useState('/products')
  const [bannerType, setBannerType] = useState('hero')
  const [discountCode, setDiscountCode] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Filter state
  const [activeTab, setActiveTab] = useState('all')

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/banners')
      setBanners(data.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleOpenAddModal = () => {
    setEditingBanner(null)
    setTitle('')
    setSubtitle('')
    setImage('')
    setLink('/products')
    setBannerType('hero')
    setDiscountCode('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner)
    setTitle(banner.title)
    setSubtitle(banner.subtitle || '')
    setImage(banner.image)
    setLink(banner.link || '/products')
    setBannerType(banner.bannerType)
    setDiscountCode(banner.discountCode || '')
    setIsActive(banner.isActive)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !image.trim()) {
      toast.error('Title and Image URL are required.')
      return
    }

    try {
      setSubmitting(true)
      const payload = { title, subtitle, image, link, bannerType, discountCode, isActive }
      
      if (editingBanner) {
        await api.put(`/banners/${editingBanner._id}`, payload)
        toast.success('Banner updated successfully')
      } else {
        await api.post('/banners', payload)
        toast.success('Banner created successfully')
      }
      setIsModalOpen(false)
      fetchBanners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return
    try {
      await api.delete(`/banners/${id}`)
      toast.success('Banner deleted successfully')
      fetchBanners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete banner')
    }
  }

  const toggleActive = async (banner) => {
    try {
      const updated = { ...banner, isActive: !banner.isActive }
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive })
      setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
      toast.success(`Banner status updated to ${!banner.isActive ? 'Active' : 'Inactive'}`)
    } catch (error) {
      toast.error('Failed to toggle status')
    }
  }

  const filteredBanners = banners.filter(banner => {
    if (activeTab === 'all') return true
    return banner.bannerType === activeTab
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners & Offers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage hero sliders, promotional campaigns, and coupon banners.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 -mb-px">
          {[
            { id: 'all', label: 'All Banners' },
            { id: 'hero', label: 'Hero Sliders' },
            { id: 'coupon', label: 'Coupon Banners' },
            { id: 'offer', label: 'Sale Offers' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          <Megaphone className="mx-auto mb-4 text-slate-350" size={40} />
          <p className="text-sm font-semibold">No banners found in this category.</p>
          <button onClick={handleOpenAddModal} className="mt-3 text-xs text-blue-600 font-bold hover:underline">
            Add your first banner →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBanners.map(banner => (
            <div key={banner._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
              {/* Banner Image Preview */}
              <div className="relative aspect-video bg-slate-100 border-b border-slate-250 overflow-hidden">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={
                    banner.bannerType === 'hero' ? 'blue' : 
                    banner.bannerType === 'coupon' ? 'green' : 'violet'
                  }>
                    {banner.bannerType === 'hero' ? 'Hero Slider' : 
                     banner.bannerType === 'coupon' ? 'Coupon' : 'Sale Offer'}
                  </Badge>
                </div>
                
                {/* Active Toggle on Image */}
                <button
                  onClick={() => toggleActive(banner)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full transition-all cursor-pointer shadow-sm ${
                    banner.isActive 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={banner.isActive ? 'Active - click to deactivate' : 'Inactive - click to activate'}
                >
                  {banner.isActive ? <Check size={16} /> : <X size={16} />}
                </button>
              </div>

              {/* Banner Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{banner.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2">{banner.subtitle || 'No subtitle provided'}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center text-xs text-slate-500 gap-1.5">
                    <LinkIcon size={12} />
                    <span className="truncate">Link: {banner.link}</span>
                  </div>
                  {banner.discountCode && (
                    <div className="flex items-center text-xs text-slate-700 gap-1.5 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-200">
                      <Tag size={12} className="text-slate-500" />
                      <span className="font-bold">Code: {banner.discountCode}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    onClick={() => handleOpenEditModal(banner)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit banner"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Banner Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monsoon Special Mega Sale!"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Banner Subtitle / Description</label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Get flat 20% OFF on all items. Use code MONSOON20."
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <ImageIcon size={12} /> Image URL *
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/... or relative path"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Link URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <LinkIcon size={12} /> Link Destination Path
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /products or /products?category=ID"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Row Grid: Type & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Banner Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Banner Type</label>
                  <select
                    value={bannerType}
                    onChange={(e) => setBannerType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500 bg-white"
                  >
                    <option value="hero">Hero Slider (Main Banner)</option>
                    <option value="coupon">Coupon Promo Banner</option>
                    <option value="offer">Special Offer Card</option>
                  </select>
                </div>

                {/* Discount Code */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Associated Coupon Code (Optional)</label>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="e.g. MONSOON20"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  Set this banner as Active immediately
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  {submitting && <Spinner size="sm" />}
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannersPage
