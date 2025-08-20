"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils/cn";
import { trackVideoView } from "@/lib/analytics/google-analytics";

interface VideoPlayerProps {
  videoId: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export function VideoPlayer({
  videoId,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${videoId}/manifest/video.m3u8`;

    try {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS support
        video.src = src;
      } else if (Hls.isSupported()) {
        // HLS.js for other browsers
        const hls = new Hls();

        hls.on(Hls.Events.ERROR, (event, data) => {

          if (data.fatal) {
            setError(true);
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        return () => {
          hls.destroy();
        };
      } else {

        setError(true);
      }
    } catch (err) {

      setError(true);
    }
  }, [videoId]);

  if (error) {
    return (
      <div className={cn("w-full h-full bg-gray-900 flex items-center justify-center", className)}>
        <p className="text-white">Video unavailable</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={cn("w-full h-full object-cover", className)}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      onError={() => setError(true)}
      onPlay={() => {
        // Track video play event
        trackVideoView(`Cloudflare Video - ${videoId}`, videoId);
      }}
    />
  );
}