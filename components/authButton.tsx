'use client';

import { Button, Box, Typography, Avatar, Chip } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export function AuthButtons() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('google', { 
        callbackUrl: '/todos',
        redirect: true 
      });
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn('github', { 
        callbackUrl: '/todos',
        redirect: true 
      });
    } catch (error) {
      console.error('GitHub sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (status === 'loading' || isSigningIn) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontFamily: 'Playfair Display, serif' }}>
          {isSigningIn ? 'Signing in...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          sx={{
            bgcolor: '#fbf7ffff',
            '&:hover': { bgcolor: '#6f2998ff', color: '#fff' },
            fontFamily: 'Playfair Display, serif',
            textTransform: 'none',
            cursor: isSigningIn ? 'not-allowed' : 'pointer',
            color: '#d32cceff'
          }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<GitHub />}
          onClick={handleGitHubSignIn}
          disabled={isSigningIn}
          sx={{
            bgcolor: '#6f2998ff',
            '&:hover': { bgcolor: '#1a1e22' },
            fontFamily: 'Playfair Display, serif',
            textTransform: 'none',
            cursor: isSigningIn ? 'not-allowed' : 'pointer',
          }}
        >
          GitHub
        </Button>
      </Box>
    );
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          src={session.user.image || undefined} 
          alt={session.user.name || 'User'}
          sx={{ width: 32, height: 32 }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography 
            variant="body2" 
            sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            {session.user.name || session.user.email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSignOut}
          sx={{ 
            fontFamily: 'Playfair Display, serif',
            textTransform: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            backgroundColor: "#9f54d6",
            color: "#fff",
            '&:hover': {
              backgroundColor: "#7b3fa0",
            },
            border:"1px solid #7b3fa0"
          }}
        >
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Chip 
      label="Auth Error" 
      color="error" 
      variant="outlined"
    />
  );
}