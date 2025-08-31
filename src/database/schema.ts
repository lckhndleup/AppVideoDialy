export interface VideoRow {
  id: string;
  name: string;
  description: string;
  video_uri: string;
  thumbnail_uri: string | null;
  duration: number;
  created_at: string;
  updated_at: string | null;
}

export const CREATE_VIDEO_TABLE = `
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    video_uri TEXT NOT NULL,
    thumbnail_uri TEXT,
    duration REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
`;

export const CREATE_INDEX_CREATED_AT = `
  CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
`;

export const CREATE_INDEX_NAME = `
  CREATE INDEX IF NOT EXISTS idx_videos_name ON videos(name);
`;