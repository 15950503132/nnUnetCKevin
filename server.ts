import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for nnU-Net projects
  let projects = [
    {
      id: "spine-seg-001",
      name: "Spine Segmentation V1",
      status: "training",
      progress: 45,
      epoch: 120,
      maxEpoch: 1000,
      dice: 0.82,
      lastUpdated: new Date().toISOString(),
      dataset: {
        train: 40,
        val: 10,
        test: 5
      }
    }
  ];

  // API Routes
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const newProject = {
      id: `spine-seg-${Math.floor(Math.random() * 1000)}`,
      status: "idle",
      progress: 0,
      epoch: 0,
      maxEpoch: 1000,
      dice: 0,
      lastUpdated: new Date().toISOString(),
      dataset: { train: 0, val: 0, test: 0 },
      ...req.body
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
