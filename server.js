import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Strict CSP might break scripts if not carefully configured; disable for general compatibility unless specifically requested
}));

// Gzip compression
app.use(compression());

// Health check endpoint (for K8s)
app.get('/health', (req, res) => {
    res.status(200).send('healthy');
});

// Serve static files from the build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
}));

// SPA Catch-all handler: Send index.html for any other requests
// Express 5 requires regex or (.*) for wildcard matching
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
