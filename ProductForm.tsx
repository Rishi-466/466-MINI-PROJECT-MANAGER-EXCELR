import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import Button from './Button';
import { GoogleGenAI } from '@google/genai';
import { MagicIcon, SpinnerIcon } from './icons/Icons';


interface ProductFormProps {
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  initialData?: Product | null;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setImageUrl(initialData.imageUrl);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      // Use a placeholder that can be replaced by the user or AI
      setImageUrl(''); 
    }
  }, [initialData]);

  // Effect to auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [description]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
        alert("Please fill all required fields.");
        return;
    }
    onSubmit({
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/400/300`,
    });
  };

  const handleGenerateImage = useCallback(async () => {
    if (!name) {
      alert("Please enter a product name first to generate an image.");
      return;
    }
    if (!process.env.API_KEY) {
        alert("API Key is not configured. You can still enter an image URL manually.");
        return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, high-quality e-commerce product photograph of: "${name}". ${description ? `Product description: "${description}"` : ''}. The product is centered on a clean, neutral, light-colored background. Studio lighting.`;
      
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
      });

      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      setImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);

    } catch (err) {
      console.error("Image generation failed", err);
      alert("Sorry, there was an error generating the image. Please check the console for details and try again later.");
    } finally {
      setIsGenerating(false);
    }
  }, [name, description]);

  const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, required?: boolean, autoComplete?: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200" />
    </div>
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      <InputField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wireless Headphones" required autoComplete="off" />
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea
            ref={textareaRef}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of the product. This field will automatically grow as you type."
            required
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none overflow-hidden transition-height duration-200 ease-in-out" />
      </div>
      <InputField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="e.g. 99.99" required autoComplete="off" />
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Image URL
            </label>
            <Button 
                type="button" 
                onClick={handleGenerateImage} 
                variant="secondary"
                className="text-xs !px-3 !py-1.5"
                disabled={isGenerating || !name}
            >
                {isGenerating ? (
                    <>
                        <SpinnerIcon className="h-4 w-4 mr-2" />
                        Generating...
                    </>
                ) : (
                    <>
                        <MagicIcon className="h-4 w-4 mr-2" />
                        Generate with AI
                    </>
                )}
            </Button>
        </div>
        <input 
            id="imageUrl" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="Generate one with AI or paste a URL here" 
            autoComplete="off" 
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200"
        />
        {!name && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter a product name to enable AI generation.</p>}
      </div>

      {imageUrl && (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image Preview</label>
            <div className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex justify-center items-center">
                <img src={imageUrl} alt="Product preview" className="rounded-md max-h-48 object-contain" />
            </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;