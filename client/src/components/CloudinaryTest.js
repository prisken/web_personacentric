import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const CloudinaryTest = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleSingleUpload = (image) => {
    console.log('Single image uploaded:', image);
    setUploadedImage(image);
  };

  const handleMultipleUpload = (images) => {
    console.log('Multiple images uploaded:', images);
    setUploadedImages(images);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Upload Test</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Single Image Upload</h2>
          <ImageUpload 
            onImageUploaded={handleSingleUpload}
            folder="test"
          >
            Upload Single Image
          </ImageUpload>
          
          {uploadedImage && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Uploaded Image:</h3>
              <img 
                src={uploadedImage.url} 
                alt="Uploaded" 
                className="w-64 h-48 object-cover rounded"
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: {uploadedImage.url}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryTest; 