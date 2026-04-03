import { ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ContentBlockImageProps {
  src?: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  overlayLabel?: string;
  objectFit?: "cover" | "contain";
}

export function ContentBlockImage({
  src,
  alt,
  aspectRatio = 16 / 10,
  className,
  overlayLabel,
  objectFit = "cover",
}: ContentBlockImageProps) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-gradient-card shadow-card", className)}>
      <AspectRatio ratio={aspectRatio}>
        <div className="relative h-full w-full bg-muted/40">
          {src ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className={cn(
                "h-full w-full transition-transform duration-500 hover:scale-105",
                objectFit === "contain" ? "object-contain p-5" : "object-cover",
              )}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-hero p-6 text-center">
              <div className="rounded-2xl border border-border bg-background/80 p-3">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Image can be updated from Firebase</p>
            </div>
          )}

          {overlayLabel ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4">
              <span className="inline-flex rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-foreground">
                {overlayLabel}
              </span>
            </div>
          ) : null}
        </div>
      </AspectRatio>
    </div>
  );
}
