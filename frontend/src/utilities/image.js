export const getServiceImageUrl = (imagePath) => {
    if (!imagePath) return '';
  
    // If it's a blob or already an object URL (preview)
    if (typeof imagePath !== 'string') {
      return URL.createObjectURL(imagePath);
    }
  
    // If it's already a full URL (e.g., S3 or external)
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
      return imagePath;
    }
  
    // Otherwise, fallback to local dev image path
    return `http://localhost:5000${
      imagePath.startsWith('/uploads/services/') ? imagePath : `/uploads/services/${imagePath}`
    }`;
  };