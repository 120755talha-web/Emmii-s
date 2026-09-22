import express from "express";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const PHOTOS_FILE = path.join(DATA_DIR, "photos.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function startServer() {
  await ensureDataDir();
  const app = express();

  // Increase payload limit to support high-res photo data URLs & PDF extracted images
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));

  // 1. Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 2. Photos API - Persistent on Server
  app.get("/api/photos", async (req, res) => {
    try {
      if (existsSync(PHOTOS_FILE)) {
        const raw = await fs.readFile(PHOTOS_FILE, "utf-8");
        const photos = JSON.parse(raw);
        return res.json({ success: true, photos });
      }
      return res.json({ success: true, photos: {} });
    } catch (err) {
      console.error("Error reading photos:", err);
      return res.status(500).json({ success: false, error: "Failed to read photos" });
    }
  });

  app.post("/api/photos", async (req, res) => {
    try {
      await ensureDataDir();
      let existing: Record<string, string> = {};
      if (existsSync(PHOTOS_FILE)) {
        try {
          const raw = await fs.readFile(PHOTOS_FILE, "utf-8");
          existing = JSON.parse(raw);
        } catch {
          existing = {};
        }
      }

      const { photos, key, dataUrl } = req.body;

      if (photos && typeof photos === "object") {
        existing = { ...existing, ...photos };
      } else if (key && dataUrl) {
        existing[key] = dataUrl;
      }

      await fs.writeFile(PHOTOS_FILE, JSON.stringify(existing), "utf-8");
      return res.json({ success: true, count: Object.keys(existing).length });
    } catch (err) {
      console.error("Error saving photos:", err);
      return res.status(500).json({ success: false, error: "Failed to save photos" });
    }
  });

  app.post("/api/reset-photos", async (req, res) => {
    try {
      if (existsSync(PHOTOS_FILE)) {
        await fs.writeFile(PHOTOS_FILE, JSON.stringify({}), "utf-8");
      }
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Failed to reset photos" });
    }
  });

  // 3. Content & Writing API - Persistent on Server
  app.get("/api/content", async (req, res) => {
    try {
      if (existsSync(CONTENT_FILE)) {
        const raw = await fs.readFile(CONTENT_FILE, "utf-8");
        const content = JSON.parse(raw);
        return res.json({ success: true, content });
      }
      return res.json({ success: true, content: null });
    } catch (err) {
      console.error("Error reading content:", err);
      return res.status(500).json({ success: false, error: "Failed to read content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      await ensureDataDir();
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ success: false, error: "Missing content in request body" });
      }
      await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (err) {
      console.error("Error saving content:", err);
      return res.status(500).json({ success: false, error: "Failed to save content" });
    }
  });

  // 4. Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
