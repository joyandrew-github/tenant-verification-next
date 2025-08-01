'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';

export default function CloudinaryUploader({ onUpload, label = 'Upload Document' }) {
  const [imageUrl, setImageUrl] = useState('');

  const handleUploadSuccess = (result) => {
    if (result.info && result.info.secure_url) {
      setImageUrl(result.info.secure_url);
      onUpload(result.info.secure_url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <CldUploadWidget
        uploadPreset="tenant_verification"
        options={{
          maxFiles: 1,
        }}
        onSuccess={handleUploadSuccess}
      >
        {({ open }) => {
          return (
            <button
              onClick={() => open()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {label}
            </button>
          );
        }}
      </CldUploadWidget>
      
      {imageUrl && (
        <div className="relative w-full h-40 mt-4">
          <Image
            src={imageUrl}
            alt="Uploaded document"
            fill
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}