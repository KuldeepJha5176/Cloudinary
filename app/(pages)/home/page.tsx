"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/videoCard'
import { Video } from '@/types'
import { Film, AlertCircle, RefreshCw } from 'lucide-react'

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")
        } finally {
            setLoading(false)
        }
    }, [])
    
    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])
    
    const handleDownload = useCallback((url: string, title: string) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${title}.mp4`;
          
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        })
        .catch(error => {
          console.error("Download failed:", error);
          window.open(url, '_blank');
        });
    }, [])
    
    if(loading){
        return (
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading videos...</p>
            </div>
          </div>
        )
    }
    
    if(error){
        return (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => {setLoading(true); fetchVideos()}}
                className="text-sm text-red-700 dark:text-red-400 underline flex items-center gap-1 mt-1"
              >
                <RefreshCw className="h-3 w-3" /> Try again
              </button>
            </div>
          </div>
        )
    }
    
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-blue-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Videos</h1>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
            <Film className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-lg font-medium">No videos available</p>
            <p className="text-sm">Upload your first video to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    );
}

export default Home