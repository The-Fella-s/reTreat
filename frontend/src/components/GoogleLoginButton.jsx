import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    const decoded = jwt_decode(tokenId);
    console.log('Google user decoded:', decoded);

    try {
      const res = await axios.post('http://localhost:5000/api/users/google-login', {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/profile';
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Google Login Failed')}
    />
  );
};

export default GoogleLoginButton;
