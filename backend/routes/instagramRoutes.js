

// Instagram route
app.get('/auth',(req, res) => {
    const authURI = 'https://api.instagram.com/oauth/authorize?client_id=${process.env.REACT_APP_ACCESS_CODE}&redirect_uri=${process.env.REACT_APP_INSTAGRAM_REDIRECT}&scope=user_profile,user_media&response_type=code';
    res.redirect(authURI);
  })
  app.get('/auth/callback', async (req, res) => {
    const {code} = req.query;
    try {
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: process.env.REACT_APP_ACCESS_CODE,
        client_secret: process.env.REACT_APP_IG_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REACT_APP_INSTAGRAM_REDIRECT,
        code,
      });
      const {access_token} = response.data;
      res.send('Access Token: ${access_token}');
    } catch (error) {
      res.status(500).send('Error');
    }
  });
  
  // Fetch Instagram Profile
  app.get('/user', async (req, res) => {
    const {access_token} = req.query;
    try {
      const response = await axios.get('https://graph.instagram.com/me?fields=id,username&access_token=${access_token}');
       
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error');
    }
  });
  
  // Fetch Instagram Media Data
  app.get('/media', async (req, res) => {
    const {access_token} = req.query;
    try {
      const response = await axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type&access_token=${access_token}');
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error');
    }
  });
  
  // IG Token Refresh
  app.get('/refresh_token', async (req, res) => {
    const {refresh_token} = req.query;
    try {
      const response = await axios.get('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${refresh_token}');
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error');
    }
  });