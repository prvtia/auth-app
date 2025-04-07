// LoggedIn.jsx
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoggedIn() {
  const navigate = useNavigate();
  
  return (
    <div className="auth-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Your Dashboard!
      </Typography>
      <Button 
        variant="contained"
        onClick={() => navigate('/')}
      >
        Logout
      </Button>
    </div>
  );
}