import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const GiftImageUpload = ({ 
  currentImageUrl = null,
  onImageUploaded,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);

  const handleImageUploaded = (imageData) => {
    setPreviewUrl(imageData.url);
    onImageUploaded(imageData);
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gift Image
        </label>
        
        {/* Current/Preview Image */}
        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Gift preview" 
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
          </div>
        )}
        
        {/* Upload Component */}
        <ImageUpload
          onImageUploaded={handleImageUploaded}
          folder="gifts"
          className="mb-4"
        >
          {previewUrl ? 'Change Gift Image' : 'Upload Gift Image'}
        </ImageUpload>
        
        <p className="text-sm text-gray-500">
          Recommended size: 1200x800 pixels. Max file size: 5MB.
        </p>
      </div>
    </div>
  );
};

export default GiftImageUpload;