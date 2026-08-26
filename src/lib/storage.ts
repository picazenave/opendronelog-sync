const KEY = "odl-sync-config-v1";

export interface AppConfig {
  serverUrl: string;
  activeProfile: string;
  sessionToken: string;
  // Support multiple sync folders. Old single `syncFolder` will be migrated on load.
  syncFolders: string[];
  // Number of concurrent uploads to run when syncing
  uploadConcurrency: number;
  theme: "light" | "dark";
}

const DEFAULT_CONFIG: AppConfig = {
  serverUrl: "",
  activeProfile: "",
  sessionToken: "",
  syncFolders: [],
  uploadConcurrency: 3,
  theme: "dark",
};

export function loadConfig(): AppConfig {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(raw) as any;
    // Backwards compatibility: if old `syncFolder` exists, migrate to `syncFolders`.
    const folders: string[] = [];
    if (Array.isArray(parsed?.syncFolders)) {
      for (const f of parsed.syncFolders) if (typeof f === "string" && f.trim()) folders.push(f.trim());
    } else if (typeof parsed?.syncFolder === "string" && parsed.syncFolder.trim()) {
      folders.push(parsed.syncFolder.trim());
    }

    return {
      serverUrl: parsed.serverUrl ?? "",
      activeProfile: parsed.activeProfile ?? "",
      sessionToken: parsed.sessionToken ?? "",
      syncFolders: folders,
      uploadConcurrency: typeof parsed?.uploadConcurrency === "number" && parsed.uploadConcurrency > 0 ? parsed.uploadConcurrency : 3,
      theme: parsed.theme === "light" ? "light" : "dark",
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(cfg: AppConfig): void {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}
