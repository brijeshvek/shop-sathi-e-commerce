import express from 'express'
import {
  getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost,
  getFaqs, createFaq, updateFaq, deleteFaq,
  getCmsPages, getCmsPageBySlug, createCmsPage, updateCmsPage, deleteCmsPage
} from '../controllers/cms.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { requirePermission } from '../middleware/role.middleware.js'

const router = express.Router()

// ==========================================
// PUBLIC CMS ROUTES (No Auth needed)
// ==========================================
router.get('/blogs', getBlogPosts)
router.get('/blogs/slug/:slug', getBlogPostBySlug)

router.get('/faqs', getFaqs)

router.get('/pages', getCmsPages)
router.get('/pages/slug/:slug', getCmsPageBySlug)

// ==========================================
// ADMIN/STAFF CMS ROUTES (Auth + Permission needed)
// ==========================================
router.use(authMiddleware)

// Blogs
router.post('/blogs', requirePermission('canManageCategories'), createBlogPost)
router.put('/blogs/:id', requirePermission('canManageCategories'), updateBlogPost)
router.delete('/blogs/:id', requirePermission('canManageCategories'), deleteBlogPost)

// FAQs
router.post('/faqs', requirePermission('canManageCategories'), createFaq)
router.put('/faqs/:id', requirePermission('canManageCategories'), updateFaq)
router.delete('/faqs/:id', requirePermission('canManageCategories'), deleteFaq)

// Pages
router.post('/pages', requirePermission('canManageCategories'), createCmsPage)
router.put('/pages/:id', requirePermission('canManageCategories'), updateCmsPage)
router.delete('/pages/:id', requirePermission('canManageCategories'), deleteCmsPage)

export default router
