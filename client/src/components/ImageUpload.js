import React, { useState } from 'react';
import apiService from '../services/api';

const ImageUpload = ({ 
  onImageUploaded, 
  folder = 'personacentric',
  multiple = false,
  maxFiles = 1,
  className = '',
  children 
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    if (!multiple && files.length > 1) {
      alert('Please select only one image');
      return;
    }
    
    if (multiple && files.length > maxFiles) {
      alert(`Please select maximum ${maxFiles} images`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append('image', files[0]);
      }
      
      formData.append('folder', folder);

      const response = await apiService.post('/upload/' + (multiple ? 'images' : 'image'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.success) {
        if (multiple) {
          onImageUploaded(response.images);
        } else {
          onImageUploaded(response.image);
        }
      } else {
        alert('Upload failed: ' + response.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      
      <label 
        htmlFor="image-upload"
        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading... {progress}%
          </div>
        ) : (
          children || 'Upload Image'
        )}
      </label>
    </div>
  );
};

export default ImageUpload; 