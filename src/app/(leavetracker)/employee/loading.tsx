"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
      {/* Background Video */}
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
  );
}
