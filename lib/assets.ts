import { supabase } from "@/lib/supabase";

export interface Asset {
  id: string;
  bucket: string;
  path: string;
  public_url: string | null;
  file_name: string;
  title: string | null;
  alt_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  folder: string;
  tags: string[];
  created_at: string;
}

export const ASSET_FOLDERS = ["general", "hero", "news", "events", "leadership", "partners", "insights", "documents"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED = /^(image\/(png|jpe?g|webp|gif|svg\+xml|avif)|application\/pdf)$/;

const slug = (s: string) =>
  s.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";

function imageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/") || file.type.includes("svg")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/** Upload a file to the public `site-assets` bucket and register it in the asset library. */
export async function uploadAsset(
  file: File,
  opts: { folder?: string; alt?: string; title?: string; bucket?: string } = {}
): Promise<Asset> {
  if (!ALLOWED.test(file.type)) throw new Error("Only images (PNG, JPG, WebP, GIF, SVG, AVIF) and PDF files are allowed.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("File is larger than 10 MB. Please compress it first.");

  const bucket = opts.bucket ?? "site-assets";
  const folder = opts.folder ?? "general";
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${folder}/${Date.now()}-${slug(file.name)}.${ext}`;

  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  const dims = await imageSize(file);
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("assets")
    .insert({
      bucket,
      path,
      public_url: pub.publicUrl,
      file_name: file.name,
      title: opts.title || file.name.replace(/\.[^.]+$/, ""),
      alt_text: opts.alt ?? null,
      mime_type: file.type,
      size_bytes: file.size,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      folder,
      uploaded_by: userData.user?.id ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Asset;
}

export async function deleteAsset(asset: Asset) {
  await supabase.storage.from(asset.bucket).remove([asset.path]);
  const { error } = await supabase.from("assets").delete().eq("id", asset.id);
  if (error) throw new Error(error.message);
}

export const isImage = (a: Pick<Asset, "mime_type">) => !!a.mime_type?.startsWith("image/");
export const prettySize = (n: number | null) =>
  !n ? "" : n > 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
