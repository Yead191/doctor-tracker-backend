export function getImageUrl(
  imageurl: string | null | undefined
): string | undefined {
  if (!imageurl || typeof imageurl !== "string" || !imageurl.trim()) {
    return undefined;
  }

  const trimmed = imageurl.trim();

  // Blob or external URLs (http://, https://, blob:)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    "http://localhost:5000/files";

  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  // If the path already has /files, strip /files from base to avoid duplicate /files/files
  if (cleanPath.startsWith("/files/")) {
    const rootBase = cleanBase.replace(/\/files\/?$/, "");
    return `${rootBase}${cleanPath}`;
  }

  // If path starts with /asset
  if (cleanPath.startsWith("/asset/")) {
    const rootBase = cleanBase.replace(/\/files\/?$/, "");
    return `${rootBase}${cleanPath}`;
  }

  return `${cleanBase}${cleanPath}`;
}
