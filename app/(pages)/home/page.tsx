"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/videoCard'
import { Video } from '@/types'

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
      // Create a fetch request to get the video as a blob
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          // Create a blob URL
          const blobUrl = URL.createObjectURL(blob);
          
          // Create an anchor element and set properties
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${title}.mp4`; // This forces download instead of navigation
          
          // Append to body, click, and clean up
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        })
        .catch(error => {
          console.error("Download failed:", error);
          // Fallback method if fetch fails
          window.open(url, '_blank');
        });
  }, [])
    
    if(loading){
        return <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-spinner loading-lg"></div>
        </div>
    }
    
    if(error){
        return <div className="alert alert-error">{error}</div>
    }
    
    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className="text-center text-lg text-gray-500 py-10">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={handleDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
    );
}

export default Home