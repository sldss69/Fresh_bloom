"use client";

import { useEffect, useState } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  tolerance?: number;
}

/**
 * Renders an image with its solid background removed via Canvas flood-fill
 * from the corners. Only removes pixels connected to the edges — interior
 * whites (e.g. flower petals) remain intact.
 */
export function TransparentImage({ src, alt, width, height, className, tolerance = 30 }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;

      // Sample background color from top-left corner
      const bgR = d[0], bgG = d[1], bgB = d[2];

      function dist(pixelIndex: number) {
        const dr = d[pixelIndex] - bgR;
        const dg = d[pixelIndex + 1] - bgG;
        const db = d[pixelIndex + 2] - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      }

      // BFS flood-fill from all 4 corners
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];

      function seed(x: number, y: number) {
        const i = y * w + x;
        if (!visited[i]) {
          visited[i] = 1;
          if (dist(i * 4) <= tolerance) queue.push(i);
        }
      }

      seed(0, 0);
      seed(w - 1, 0);
      seed(0, h - 1);
      seed(w - 1, h - 1);

      let qi = 0;
      while (qi < queue.length) {
        const idx = queue[qi++];
        d[idx * 4 + 3] = 0; // transparent
        const x = idx % w;
        const y = Math.floor(idx / w);
        const neighbors: [number, number][] = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const ni = ny * w + nx;
          if (!visited[ni]) {
            visited[ni] = 1;
            if (dist(ni * 4) <= tolerance) queue.push(ni);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setUrl(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src, tolerance]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url ?? src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={url ? {} : { opacity: 0 }}
    />
  );
}
