import http from 'http';

const modulePath = './filmysearch.js';
const filmyModule = await import(modulePath);
const handler = filmyModule.default;

const server = http.createServer(async (req, res) => {
  const baseURL = 'http://' + req.headers.host + '/';
  const parsedURL = new URL(req.url, baseURL);
  req.query = Object.fromEntries(parsedURL.searchParams.entries());
  
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
