import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';

// for local development
// const API_URL = "http://127.0.0.1:5000"

// deployed
const API_URL = "https://avin-net-test-be-2l2i6lgdxq-wl.a.run.app"

function App() {
  // Set states for ipAdress (textbox), result array, loading, and error
  const [ipAddress, setIpAddress] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event:any) => {
    // function to handle submitting and post to flask api 
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch(API_URL + '/search-arin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip_address: ipAddress }),
    });

    setLoading(false);
    if (response.ok) {
      const data = await response.json();
      if (data.net_range) {
        setResults([...results, `${ipAddress}: ${data.net_range}`]); // Add new result
      } else {
        setError(data.error || 'Unknown error');
      }
    } else {
      setError('Failed to fetch data.');
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Arin.net Query Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" marginTop={2}>
        <Box component="form" onSubmit={handleSubmit} display="flex" justifyContent="center" gap={2} style={{ width: '70%', minWidth: '320px' }}>
          <TextField
            fullWidth
            label="IP Address"
            variant="outlined"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
        <Box marginTop={2} width="70%" minWidth="320px">
          {results.map((result, index) => (
            <Paper key={index} elevation={3} style={{ padding: '16px', margin: '8px 0', borderRadius: '4px' }}>
              {result}
            </Paper>
          ))}
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default App;
