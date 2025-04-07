
import React, { useState, useRef,useContext,useEffect  } from 'react';
import Webcam from 'react-webcam';
import {Button,Box,Typography,CircularProgress,Snackbar} from '@mui/material';
import {CircleOutlined, CircleRounded, Face,Face2,Face2Outlined,LockClockOutlined,LockOpen, LoginOutlined} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

const API_URL='http://localhost:5001';

const videoConstraints={
  facingMode: 'user',
  // width:'1280',
  // height:'720'
};

export default function FaceReg(){
  const webcamRef=useRef(null);
  const [mode,setMode]=useState('login');
  const [username,setUsername]=useState('');
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      const redirectTimer = setTimeout(() => {
        navigate('/logged-in');
        setShouldRedirect(false);
      }, 5000); 
      
      return () => clearTimeout(redirectTimer);
    }
  }, [shouldRedirect, navigate]);

  const capture = async () => {
    setLoading(true);
    try {
      const image = webcamRef.current.getScreenshot();
      if (!image) {
        throw new Error('Failed to capture image');
      }
  
      const payload = mode === 'register' 
        ? { image: image.split(',')[1], username } 
        : { image: image.split(',')[1] };
  
      console.log('Sending payload:', payload);
  
      const { data } = await axios.post(
        `${API_URL}/${mode}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Response:', data);
      if(data.success){
        setMessage(data.message || `${mode === 'login' ? 'Welcome' : 'Registered'} ${data.user || username}!`);
        setOpen(true);
        setShouldRedirect(true);
      }else{
        setMessage('Authentication Failed');
        setOpen(true);
      }
      
    } catch (err) {
      console.error('Error:', err);
      setMessage(err.response?.data?.message || err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };
  return(
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{textAlign:'center',width:'100vw',alignContent:'center',justifyContent:'centerz'}}>
      <Typography variant='h3' gutterBottom>
        {mode === 'login' ? 'Face Login' : 'Register Face'}
      </Typography>
      <Box sx={{display:'flex',justifyContent:'center' }}>
      <Box sx={{ border: '3px solid #1976d2', borderRadius: 5,overflow:'hidden',backgroundColor:'black'}}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ width: '100%', maxWidth: 640,maxHeight:690,height:'100%' }}
          />
      </Box>
      </Box>
      {mode === 'register' && (
        <input
        type="text"
        placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            margin: '16px',
            padding: '12px',
            fontSize: '1.1rem',
            border: '2px solid #1976d2',
            borderRadius: 4
          }}
        />
      )}

      <Box sx={{ '& button': { m: 1 } }}>
        <Button
          variant="contained"
          size="large"
          // startIcon={loading ? <CircleRounded/> : mode === 'login' ? <LockClockOutlined/> :<Face2/> }
          //DO NOT USE THAT ABOVE IT STOPS WORKING 
          onClick={capture}
          disabled={loading}
          sx={{ px: 4, py: 1.5 }}
          >
          {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
          </Button>

        <Button
          style={{backgroundColor:'black'}}
          variant="outlined"
          size="large"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage('');
          }}
          sx={{ px: 4, py: 1.5 }}
          >
          Switch to {mode === 'login' ? 'Register' : 'Login'}
        </Button>
      </Box>

      {message && (
        // <Typography
        // variant="h6"
        // color={message.includes('Welcome') || message.includes('Registered') ? 'success' : 'error'}
        // sx={{ mt: 3 }}
        // >
        //   {message}
        // </Typography>
        <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
        
      )}


    </Box>
    </ThemeProvider>
  )
}