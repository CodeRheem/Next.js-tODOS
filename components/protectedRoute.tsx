'use client';

import { ReactNode } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { AuthButtons } from './authButton';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <Box sx={{ textAlign: 'center', mt: 8, px: 2 }}>
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Playfair Display, serif' }}>
            Sign in to start curating your tasks
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Choose your preferred sign-in method below
          </Typography>
          <AuthButtons />
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}