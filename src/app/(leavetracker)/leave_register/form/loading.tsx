"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80">
      {/* Background Video */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          src="/videos/loadingvideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="max-w-full max-h-full"
        />

        {/* Loader Circle */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
