import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentBlockImageProps {
  src?: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  overlayLabel?: string;
  objectFit?: "cover" | "contain";
  adaptive?: boolean;
}

export function ContentBlockImage({
  src,
  alt,
  aspectRatio,
  className,
  overlayLabel,
  objectFit = "cover",
  adaptive = true,
}: ContentBlockImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If adaptive and no fixed aspect ratio requested, let image define its own size
  const useNaturalSize = adaptive && !aspectRatio;

  const imgElement = src && !error ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={cn(
        "transition-transform duration-500 hover:scale-105",
        useNaturalSize ? "w-full h-auto" : "h-full w-full",
        objectFit === "contain" ? "object-contain p-5" : "object-cover",
        !loaded && "opacity-0",
        loaded && "opacity-100 transition-opacity duration-300",
      )}
    />
  ) : null;

  const placeholder = (
    <div className="flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted/60 to-muted/30 p-6 text-center">
      <div className="rounded-2xl border border-border bg-background/80 p-3">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">Image can be updated from Admin</p>
    </div>
  );

  const overlay = overlayLabel ? (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4">
      <span className="inline-flex rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-foreground">
        {overlayLabel}
      </span>
    </div>
  ) : null;

  if (useNaturalSize) {
    return (
      <div className={cn("overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-card/80 shadow-sm", className)}>
        <div className="relative">
          {imgElement || placeholder}
          {overlay}
        </div>
      </div>
    );
  }

  // Fixed aspect ratio mode
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-card/80 shadow-sm", className)}>
      <div className="relative" style={{ paddingBottom: `${100 / (aspectRatio || 16 / 10)}%` }}>
        <div className="absolute inset-0">
          {imgElement || placeholder}
          {overlay}
        </div>
      </div>
    </div>
  );
}
