import React, { useState } from 'react';
import apiService from '../services/api';

const AgentProfileImageUpload = ({ 
  currentImageUrl = null,
  onImageUploaded,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Upload image to /api/upload/image
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'agent-profiles');

      const uploadResponse = await apiService.uploadFile('/upload/image', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (!uploadResponse.success) {
        alert('Image upload failed: ' + uploadResponse.error);
        setPreviewUrl(currentImageUrl); // Revert preview
        setUploading(false);
        setProgress(0);
        return;
      }

      // Step 2: Update agent profile with new image URL
      const profileUpdateResponse = await apiService.put('/users/agent/profile', {
        profile_image: uploadResponse.image.url,
        bio: '' // Add other fields as needed
      });

      if (profileUpdateResponse.success) {
        onImageUploaded(uploadResponse.image.url);
      } else {
        alert('Profile update failed: ' + profileUpdateResponse.error);
        setPreviewUrl(currentImageUrl); // Revert preview
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setPreviewUrl(currentImageUrl); // Revert preview
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        
        {/* Current/Preview Image */}
        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Profile preview" 
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        )}
        
        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="agent-profile-upload"
        />
        
        <label 
          htmlFor="agent-profile-upload"
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
            previewUrl ? 'Change Profile Image' : 'Upload Profile Image'
          )}
        </label>
      </div>
    </div>
  );
};

export default AgentProfileImageUpload; 