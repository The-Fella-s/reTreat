export const getServiceImageUrl = (imagePath) => {
    if (!imagePath) return '';

    if (typeof imagePath !== 'string') {
        return URL.createObjectURL(imagePath);
    }

    if (imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
        return imagePath;
    }

    return `http://localhost:5000${
        imagePath.startsWith('/uploads/services/')
            ? imagePath
            : `/uploads/services/${imagePath}`
    }`;
};
