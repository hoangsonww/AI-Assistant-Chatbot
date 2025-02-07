import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { verifyEmail, resetPassword } from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    setError('');
    setLoadingVerify(true);
    try {
      const response = await verifyEmail(email); // Should return { exists: boolean }
      if (response.exists) {
        setEmailVerified(true);
      } else {
        setError('Email not found');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
    setLoadingVerify(false);
  };

  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoadingReset(true);
    try {
      await resetPassword(email, newPassword);
      alert('Password reset successfully. Please login with your new password.');
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
    setLoadingReset(false);
  };

  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <Paper style={{ padding: '2rem', maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" marginBottom="1rem">
          Forgot Password
        </Typography>
        {!emailVerified ? (
          <>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingVerify}
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyEmail}
              style={{ marginTop: '1rem' }}
              disabled={loadingVerify || email.trim() === ''}
            >
              {loadingVerify ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Verify Email'
              )}
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="New Password"
              margin="normal"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loadingReset}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      edge="end"
                      disabled={loadingReset}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              margin="normal"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loadingReset}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      disabled={loadingReset}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleResetPassword}
              style={{ marginTop: '1rem' }}
              disabled={loadingReset || newPassword.trim() === '' || confirmPassword.trim() === ''}
            >
              {loadingReset ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </>
        )}
        <Box marginTop="1rem">
          <Typography variant="body2">
            Remembered your password?{' '}
            <Button onClick={() => navigate('/login')} color="primary">
              Login
            </Button>
          </Typography>
          <Typography variant="body2">
            Continue as Guest?{' '}
            <Button style={{ 'color': 'green' }} onClick={() => navigate('/chat')} color="primary">
              Back to Chat
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
