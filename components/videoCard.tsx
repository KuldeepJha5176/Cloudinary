import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Play, Pause } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import {filesize} from "filesize";
import { Video } from '@/types';
dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video"
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
    if (isHovered) {
      setIsPreviewLoading(true);
      hoverTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setIsPreviewLoading(false);
            })
            .catch(() => {
              setPreviewError(true);
              setIsPreviewLoading(false);
            });
        }
      }, 300);
    } else {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    }
    
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
    setIsPreviewLoading(false);
  };

  const handleVideoLoaded = () => {
    setIsPreviewLoading(false);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setPreviewError(true));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative overflow-hidden">
        {/* Preview loading spinner */}
        {isHovered && isPreviewLoading && !previewError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Video preview */}
        {isHovered && !previewError && (
          <video
            ref={videoRef}
            src={getPreviewVideoUrl(video.publicId)}
            muted
            loop
            className="w-full h-full object-cover"
            onError={handlePreviewError}
            onLoadedData={handleVideoLoaded}
          />
        )}
        
        {/* Thumbnail image */}
        <img
          src={getThumbnailUrl(video.publicId)}
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered && !previewError && !isPreviewLoading ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Preview error message */}
        {isHovered && previewError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-80 text-gray-700 dark:text-gray-300">
            <p className="text-red-500 dark:text-red-400 text-sm font-medium">Preview not available</p>
          </div>
        )}
        
        {/* Play/Pause button */}
        <button 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm bg-purple-500/70 hover:bg-purple-600/90 text-white transition-all ${isHovered && !previewError && !isPreviewLoading ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center">
          <Clock size={14} className="mr-1 text-purple-300" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      
      <div className="p-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{video.title}</h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 flex items-center">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        
        {/* File size info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-start">
            <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 mr-2">
              <FileUp size={16} className="text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-gray-500 dark:text-gray-400 text-xs">Original</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 mr-2">
              <FileDown size={16} className="text-teal-500 dark:text-teal-400" />
            </div>
            <div>
              <div className="font-medium text-gray-500 dark:text-gray-400 text-xs">Compressed</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Compression
            </div>
            <div className="text-sm font-semibold text-teal-500 dark:text-teal-400">
              {compressionPercentage}%
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-teal-400 rounded-full"
              style={{ width: `${compressionPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Download button */}
        <button
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium flex items-center justify-center transition-all"
          onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
        >
          <Download size={18} className="mr-2" />
          Download Video
        </button>
      </div>
    </div>
  );
};

export default VideoCard;