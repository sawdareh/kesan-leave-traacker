
"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <video
        src="/videos/loadingvideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}