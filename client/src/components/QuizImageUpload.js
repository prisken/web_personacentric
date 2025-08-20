import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const QuizImageUpload = ({ 
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
          測驗圖片
        </label>
        
        {/* Current/Preview Image */}
        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Quiz preview" 
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
          </div>
        )}
        
        {/* Upload Component */}
        <ImageUpload
          onImageUploaded={handleImageUploaded}
          folder="quizzes"
          className="mb-4"
        >
          {previewUrl ? '更換測驗圖片' : '上傳測驗圖片'}
        </ImageUpload>
        
        <p className="text-sm text-gray-500">
          建議尺寸: 1200x800 像素。最大檔案大小: 5MB。
        </p>
      </div>
    </div>
  );
};

export default QuizImageUpload; 