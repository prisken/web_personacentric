import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCurrentUser } = useUser();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  
  const token = searchParams.get('token');
  const provider = searchParams.get('provider');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login?error=auth_failed'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received. Please try again.');
          setTimeout(() => navigate('/login?error=no_token'), 3000);
          return;
        }

        // Store the token
        localStorage.setItem('token', token);
        
        // Fetch user data
        await fetchCurrentUser();
        
        setStatus('success');
        setMessage(`Successfully logged in with ${provider || 'social authentication'}!`);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Failed to complete authentication. Please try again.');
        setTimeout(() => navigate('/login?error=auth_failed'), 3000);
      }
    };

    handleAuthCallback();
  }, [token, provider, error, navigate, fetchCurrentUser]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        );
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <i className="fas fa-check text-green-600 text-xl"></i>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <i className="fas fa-times text-red-600 text-xl"></i>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className={`w-12 h-12 bg-gradient-to-r ${
            status === 'success' ? 'from-green-600 to-blue-600' :
            status === 'error' ? 'from-red-600 to-orange-600' :
            'from-blue-600 to-green-600'
          } rounded-lg flex items-center justify-center`}>
            {status === 'processing' ? (
              <i className="fas fa-spinner text-white text-lg"></i>
            ) : status === 'success' ? (
              <i className="fas fa-check text-white text-lg"></i>
            ) : (
              <i className="fas fa-exclamation-triangle text-white text-lg"></i>
            )}
          </div>
        </div>
        <h2 className={`mt-6 text-center text-3xl font-bold ${getStatusColor()}`}>
          {status === 'processing' && 'Completing Authentication...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {message}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {getStatusIcon()}
            
            <h3 className={`mt-4 text-lg font-medium ${getStatusColor()}`}>
              {status === 'processing' && 'Please wait...'}
              {status === 'success' && 'Welcome!'}
              {status === 'error' && 'Something went wrong'}
            </h3>
            
            <p className="mt-2 text-sm text-gray-500">
              {status === 'processing' && 'We are completing your authentication and setting up your account.'}
              {status === 'success' && 'You have been successfully authenticated. Redirecting you to your dashboard...'}
              {status === 'error' && 'There was an issue with the authentication process. You will be redirected to the login page.'}
            </p>
            
            {status === 'processing' && (
              <div className="mt-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Processing...</span>
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Redirecting...</span>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
