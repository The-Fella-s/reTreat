import React from 'react';
import { Box, useTheme } from '@mui/material';

const apiKey = import.meta.env.VITE_GOOGLE_MAP_API;

const MapEmbed = () => {
  const theme = useTheme();
  const location = 'reTreat Salon & Spa, 198 Cirby Way Suite 135, Roseville, CA 95678';
  const locationQuery = encodeURIComponent(location);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${locationQuery}`;
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${locationQuery}`;

  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        '& iframe': {
          border: `0px solid ${theme.palette.secondary.main}`,
          borderRadius: '40px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          maxWidth: '850px',
          width: '100%',
          height: '220px',
        },
        '&:hover iframe': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35)',
        },
      }}
    >
      <iframe
        title="Google Maps Location"
        loading="lazy"
        allowFullScreen
        src={mapSrc}
      />
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          borderRadius: '14px',
          cursor: 'pointer',
        }}
        aria-label="Open directions in Google Maps"
      />
    </Box>
  );
};

export default MapEmbed;
