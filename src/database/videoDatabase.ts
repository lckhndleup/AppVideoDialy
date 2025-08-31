import * as SQLite from "expo-sqlite";
import { VideoItem } from "@/src/types";
import {
  CREATE_VIDEO_TABLE,
  CREATE_INDEX_CREATED_AT,
  CREATE_INDEX_NAME,
  VideoRow } from
"./schema";

class VideoDatabase {
  private db: SQLite.SQLiteDatabase;
  private initialized = false;

  constructor() {
    this.db = SQLite.openDatabaseSync("videos.db");
  }

  initialize(): void {
    if (this.initialized) return;

    try {

      this.db.execSync(CREATE_VIDEO_TABLE);
      this.db.execSync(CREATE_INDEX_CREATED_AT);
      this.db.execSync(CREATE_INDEX_NAME);

      this.initialized = true;
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    }
  }

  getAllVideos(): VideoItem[] {
    this.initialize();

    try {
      const rows = this.db.getAllSync(
        "SELECT * FROM videos ORDER BY created_at DESC"
      ) as VideoRow[];

      return rows.map(this.mapRowToVideoItem);
    } catch (error) {
      console.error("Get all videos error:", error);
      throw error;
    }
  }

  getVideoById(id: string): VideoItem | null {
    this.initialize();

    try {
      const row = this.db.getFirstSync("SELECT * FROM videos WHERE id = ?", [
      id]
      ) as VideoRow | null;

      return row ? this.mapRowToVideoItem(row) : null;
    } catch (error) {
      console.error("Get video by id error:", error);
      throw error;
    }
  }

  insertVideo(video: VideoItem): void {
    this.initialize();

    try {
      this.db.runSync(
        `INSERT INTO videos (
          id, name, description, video_uri, thumbnail_uri, 
          duration, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        video.id,
        video.name,
        video.description,
        video.videoUri,
        video.thumbnailUri || null,
        video.duration,
        video.createdAt.toISOString(),
        video.updatedAt?.toISOString() || null]

      );

      console.log("Video inserted successfully:", video.id);
    } catch (error) {
      console.error("Insert video error:", error);
      throw error;
    }
  }

  updateVideo(id: string, updates: Partial<VideoItem>): void {
    this.initialize();

    try {
      const setClause = [];
      const values = [];

      if (updates.name !== undefined) {
        setClause.push("name = ?");
        values.push(updates.name);
      }
      if (updates.description !== undefined) {
        setClause.push("description = ?");
        values.push(updates.description);
      }
      if (updates.thumbnailUri !== undefined) {
        setClause.push("thumbnail_uri = ?");
        values.push(updates.thumbnailUri);
      }


      setClause.push("updated_at = ?");
      values.push(new Date().toISOString());


      values.push(id);

      this.db.runSync(
        `UPDATE videos SET ${setClause.join(", ")} WHERE id = ?`,
        values
      );

      console.log("Video updated successfully:", id);
    } catch (error) {
      console.error("Update video error:", error);
      throw error;
    }
  }

  deleteVideo(id: string): void {
    this.initialize();

    try {
      this.db.runSync("DELETE FROM videos WHERE id = ?", [id]);
      console.log("Video deleted successfully:", id);
    } catch (error) {
      console.error("Delete video error:", error);
      throw error;
    }
  }

  searchVideos(query: string): VideoItem[] {
    this.initialize();

    try {
      const rows = this.db.getAllSync(
        `SELECT * FROM videos 
         WHERE name LIKE ? OR description LIKE ? 
         ORDER BY created_at DESC`,
        [`%${query}%`, `%${query}%`]
      ) as VideoRow[];

      return rows.map(this.mapRowToVideoItem);
    } catch (error) {
      console.error("Search videos error:", error);
      throw error;
    }
  }

  getVideoStats(): {
    totalCount: number;
    totalDuration: number;
    oldestDate: string | null;
    newestDate: string | null;
  } {
    this.initialize();

    try {
      const stats = this.db.getFirstSync(
        `SELECT 
          COUNT(*) as totalCount,
          SUM(duration) as totalDuration,
          MIN(created_at) as oldestDate,
          MAX(created_at) as newestDate
         FROM videos`
      ) as {
        totalCount: number;
        totalDuration: number;
        oldestDate: string | null;
        newestDate: string | null;
      };

      return {
        totalCount: stats.totalCount || 0,
        totalDuration: stats.totalDuration || 0,
        oldestDate: stats.oldestDate,
        newestDate: stats.newestDate
      };
    } catch (error) {
      console.error("Get video stats error:", error);
      throw error;
    }
  }

  clearAllVideos(): void {
    this.initialize();

    try {
      this.db.runSync("DELETE FROM videos");
      console.log("All videos cleared from database");
    } catch (error) {
      console.error("Clear all videos error:", error);
      throw error;
    }
  }


  insertVideos(videos: VideoItem[]): void {
    this.initialize();

    try {
      this.db.withTransactionSync(() => {
        const statement = this.db.prepareSync(
          `INSERT INTO videos (
            id, name, description, video_uri, thumbnail_uri, 
            duration, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );

        for (const video of videos) {
          statement.executeSync([
          video.id,
          video.name,
          video.description,
          video.videoUri,
          video.thumbnailUri || null,
          video.duration,
          video.createdAt.toISOString(),
          video.updatedAt?.toISOString() || null]
          );
        }

        statement.finalizeSync();
      });

      console.log(`${videos.length} videos inserted successfully`);
    } catch (error) {
      console.error("Batch insert videos error:", error);
      throw error;
    }
  }

  deleteVideos(ids: string[]): void {
    this.initialize();

    try {
      this.db.withTransactionSync(() => {
        const statement = this.db.prepareSync(
          "DELETE FROM videos WHERE id = ?"
        );

        for (const id of ids) {
          statement.executeSync([id]);
        }

        statement.finalizeSync();
      });

      console.log(`${ids.length} videos deleted successfully`);
    } catch (error) {
      console.error("Batch delete videos error:", error);
      throw error;
    }
  }

  getVideosByDateRange(startDate: Date, endDate: Date): VideoItem[] {
    this.initialize();

    try {
      const rows = this.db.getAllSync(
        `SELECT * FROM videos 
         WHERE created_at BETWEEN ? AND ? 
         ORDER BY created_at DESC`,
        [startDate.toISOString(), endDate.toISOString()]
      ) as VideoRow[];

      return rows.map(this.mapRowToVideoItem);
    } catch (error) {
      console.error("Get videos by date range error:", error);
      throw error;
    }
  }

  getVideosPaginated(
  limit: number,
  offset: number = 0)
  : {
    videos: VideoItem[];
    hasMore: boolean;
    total: number;
  } {
    this.initialize();

    try {

      const totalResult = this.db.getFirstSync(
        "SELECT COUNT(*) as count FROM videos"
      ) as {count: number;};

      const total = totalResult.count;


      const rows = this.db.getAllSync(
        `SELECT * FROM videos 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      ) as VideoRow[];

      const videos = rows.map(this.mapRowToVideoItem);
      const hasMore = offset + limit < total;

      return {
        videos,
        hasMore,
        total
      };
    } catch (error) {
      console.error("Get paginated videos error:", error);
      throw error;
    }
  }

  private mapRowToVideoItem(row: VideoRow): VideoItem {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      videoUri: row.video_uri,
      thumbnailUri: row.thumbnail_uri || undefined,
      duration: row.duration,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }


  healthCheck(): boolean {
    try {
      this.initialize();
      const result = this.db.getFirstSync("SELECT 1 as test") as {
        test: number;
      };
      return result.test === 1;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }


  close(): void {
    try {
      this.db.closeSync();
      this.initialized = false;
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error closing database:", error);
    }
  }
}

export const videoDatabase = new VideoDatabase();