const http = require('http');
import('./api/filmysearch.js').then((module) => {
  const handler = module.default;
  
  const server = http.createServer(async (req, res) => {
    // URL query parser
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedURL = new URL(req.url, baseURL);
    req.query = Object.fromEntries(parsedURL.searchParams.entries());
    
    // Response helper methods
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    try {
      await handler(req, res);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to load filmysearch.js:", err);
});
