import CategoryAttribute from '../models/CategoryAttribute.model.js'
import Category from '../models/Category.model.js'

// Get attributes for a specific category
export const getCategoryAttributes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // First find the attributes schema directly for this category
    let attrSchema = await CategoryAttribute.findOne({ category: categoryId }).populate('category', 'name');
    
    // If not found, and it's a subcategory, maybe fall back to parent category attributes?
    // Based on requirements, attributes belong to main category usually, 
    // but allowing them on any category gives flexibility.
    
    if (!attrSchema) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No attributes found for this category'
      });
    }

    res.status(200).json({
      success: true,
      data: attrSchema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attributes',
      error: error.message
    });
  }
};

// Get all category attributes (for dashboard management)
export const getAllCategoryAttributes = async (req, res) => {
  try {
    const attributes = await CategoryAttribute.find().populate('category', 'name slug');
    res.status(200).json({
      success: true,
      count: attributes.length,
      data: attributes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all attributes',
      error: error.message
    });
  }
};

// Create or update attributes for a category
export const upsertCategoryAttributes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { fields } = req.body; // Array of attribute fields

    if (!fields || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: 'Fields array is required'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Upsert
    const attrSchema = await CategoryAttribute.findOneAndUpdate(
      { category: categoryId },
      { category: categoryId, fields },
      { new: true, upsert: true, runValidators: true }
    ).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Attributes updated successfully',
      data: attrSchema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upsert attributes',
      error: error.message
    });
  }
};

// Delete attributes for a category
export const deleteCategoryAttributes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const deleted = await CategoryAttribute.findOneAndDelete({ category: categoryId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Attributes not found for this category'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category attributes deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete attributes',
      error: error.message
    });
  }
};
