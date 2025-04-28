'use client'
import React, { useState, useRef, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { Upload, Image as ImageIcon, Download } from 'lucide-react'

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Youtube Thumbnail(16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
}

type SocialFormat = keyof typeof socialFormats

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)")
  const [isUploading, setIsUploading] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true)
    }
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    
    // Add client-side validation
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large (max 10MB)")
      setIsUploading(false)
      return
    }
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }
      
      setUploadedImage(data.publicId)
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async () => {
    if (!imageRef.current) return

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `social-${selectedFormat.toLowerCase().replace(/\s/g, '-')}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-2 items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Social Media Image Creator</h1>
        <p className="text-slate-500 dark:text-slate-400">Transform your images for social media platforms</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upload an Image</h2>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Choose an image file
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 
                    file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:dark:bg-blue-900/30 
                    file:text-blue-700 file:dark:text-blue-400 hover:file:bg-blue-100 hover:file:dark:bg-blue-900/50 
                    border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700"
                  accept="image/*"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-slate-700/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                <div className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            )}

            {uploadedImage && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Transform Your Image</h2>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select Format
                  </label>
                  <select
                    className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Preview:</h3>
                  <div className="flex justify-center bg-slate-50 dark:bg-slate-700 p-4 rounded-lg relative">
                    {isTransforming && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 rounded-lg z-10">
                        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="max-h-96 object-contain rounded shadow"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    Download for {selectedFormat}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}