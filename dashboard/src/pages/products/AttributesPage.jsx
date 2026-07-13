import React, { useState, useEffect } from 'react';
import { List, Plus, Save, Edit, Trash2, Settings, GripVertical, PlusCircle, X } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js';
import { useGetCategoryAttributesQuery, useUpsertCategoryAttributesMutation } from '../../features/attributes/attributesApi.js';
import { toast } from 'react-hot-toast';

export const AttributesPage = () => {
  const { data: categoriesResponse, isLoading: catsLoading } = useGetCategoriesQuery();
  const mainCategories = categoriesResponse?.data?.filter(c => !c.parent) || [];
  
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  const { data: attrResponse, isLoading: attrLoading, refetch } = useGetCategoryAttributesQuery(selectedCategoryId, {
    skip: !selectedCategoryId
  });
  
  const [upsertAttributes, { isLoading: isSaving }] = useUpsertCategoryAttributesMutation();

  const [fields, setFields] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Form state for current attribute
  const [currentField, setCurrentField] = useState({
    key: '',
    label: '',
    type: 'text',
    required: false,
    options: '',
    defaultValue: ''
  });

  // When selected category's attributes are fetched, load them into state
  useEffect(() => {
    if (attrResponse?.data?.fields) {
      setFields(attrResponse.data.fields);
    } else {
      setFields([]);
    }
  }, [attrResponse, selectedCategoryId]);

  useEffect(() => {
    if (mainCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(mainCategories[0]._id);
    }
  }, [mainCategories]);

  const handleSaveField = () => {
    if (!currentField.key || !currentField.label) {
      return toast.error("Key and Label are required");
    }
    
    let processedOptions = [];
    if (['select', 'multiselect'].includes(currentField.type)) {
      if (!currentField.options) return toast.error("Options are required for select types");
      processedOptions = typeof currentField.options === 'string' 
        ? currentField.options.split(',').map(s => s.trim()).filter(Boolean)
        : currentField.options;
    }

    const newField = {
      ...currentField,
      options: processedOptions,
      // Boolean handling for checkbox default value
      defaultValue: currentField.type === 'checkbox' ? (currentField.defaultValue === 'true' || currentField.defaultValue === true) : currentField.defaultValue
    };

    let updatedFields = [...fields];
    if (editingIndex !== null) {
      updatedFields[editingIndex] = newField;
    } else {
      updatedFields.push(newField);
    }

    setFields(updatedFields);
    resetForm();
  };

  const handleEditField = (index) => {
    const field = fields[index];
    setCurrentField({
      ...field,
      options: field.options ? field.options.join(', ') : '',
      defaultValue: field.defaultValue !== undefined ? field.defaultValue.toString() : ''
    });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleDeleteField = (index) => {
    if (window.confirm("Are you sure you want to remove this attribute?")) {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      await upsertAttributes({
        categoryId: selectedCategoryId,
        fields
      }).unwrap();
      toast.success("Attributes configuration saved successfully!");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save attributes");
    }
  };

  const resetForm = () => {
    setCurrentField({ key: '', label: '', type: 'text', required: false, options: '', defaultValue: '' });
    setEditingIndex(null);
    setIsEditing(false);
  };

  if (catsLoading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Attributes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage dynamic product attributes and schema variations per category.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => refetch()} disabled={isSaving}>
            Discard Changes
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSaveConfiguration} isLoading={isSaving}>
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Categories</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto p-2 space-y-1">
            {mainCategories.map(cat => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategoryId(cat._id);
                  setIsEditing(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCategoryId === cat._id 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Attributes Editor */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Form Modal/Section for Adding/Editing */}
          {isEditing && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 shadow-sm relative">
              <button 
                onClick={resetForm}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-white rounded-lg shadow-sm"
              >
                <X size={18} />
              </button>
              
              <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-indigo-500" />
                {editingIndex !== null ? 'Edit Attribute' : 'Add New Attribute'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Field Label (Display)</label>
                  <input
                    type="text"
                    value={currentField.label}
                    onChange={(e) => setCurrentField({...currentField, label: e.target.value})}
                    placeholder="e.g. RAM, Material"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Field Key (Internal)</label>
                  <input
                    type="text"
                    value={currentField.key}
                    onChange={(e) => setCurrentField({...currentField, key: e.target.value})}
                    placeholder="e.g. ram, material"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Input Type</label>
                  <select
                    value={currentField.type}
                    onChange={(e) => setCurrentField({...currentField, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="text">Text (String)</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown (Select)</option>
                    <option value="multiselect">Multi-Select</option>
                    <option value="checkbox">Checkbox (Boolean)</option>
                    <option value="date">Date Picker</option>
                  </select>
                </div>

                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentField.required}
                      onChange={(e) => setCurrentField({...currentField, required: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Required Field</span>
                  </label>
                </div>
              </div>

              {['select', 'multiselect'].includes(currentField.type) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dropdown Options (Comma separated)</label>
                  <input
                    type="text"
                    value={currentField.options}
                    onChange={(e) => setCurrentField({...currentField, options: e.target.value})}
                    placeholder="e.g. Small, Medium, Large"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate options using commas.</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Value (Optional)</label>
                <input
                  type={currentField.type === 'number' ? 'number' : 'text'}
                  value={currentField.defaultValue}
                  onChange={(e) => setCurrentField({...currentField, defaultValue: e.target.value})}
                  placeholder="Default value when adding a product"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveField}>
                  {editingIndex !== null ? 'Update Attribute' : 'Add Attribute'}
                </Button>
              </div>
            </div>
          )}

          {/* List of Attributes */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <List size={18} className="text-indigo-600" />
                Configured Attributes 
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                  {fields.length}
                </span>
              </h3>
              {!isEditing && (
                <Button variant="secondary" icon={PlusCircle} onClick={() => setIsEditing(true)} size="sm">
                  Add Attribute
                </Button>
              )}
            </div>
            
            {attrLoading ? (
              <div className="p-8 text-center text-slate-500">Loading attributes...</div>
            ) : fields.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <List size={24} />
                </div>
                <p className="text-slate-500">No attributes configured for this category yet.</p>
                <button onClick={() => setIsEditing(true)} className="mt-3 text-indigo-600 font-medium hover:underline text-sm">
                  + Add first attribute
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {fields.map((field, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-slate-300 cursor-grab">
                        <GripVertical size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{field.label}</h4>
                          <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {field.key}
                          </span>
                          {field.required && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          Type: <span className="font-medium capitalize text-slate-700">{field.type}</span>
                          {['select', 'multiselect'].includes(field.type) && field.options?.length > 0 && (
                            <span>• {field.options.length} options</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditField(idx)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Attribute"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteField(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Attribute"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesPage;
