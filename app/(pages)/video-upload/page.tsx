'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  
  //max file size of 70 MB
  const MAX_FILE_SIZE = 70 * 1024 * 1024
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      alert('Please fill Title')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File size is too big')
      return
    }
    
    setIsUploading(true)
    setMessage('')
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('originalSize', file.size.toString())
    
    try {
      const response = await axios.post('/api/video-upload', formData)
      setMessage('Video uploaded successfully')
      router.push('/home')
    } catch (error) {
      console.log('error on uploading file axios tryCatch', error)
      setMessage('Failed to upload video')
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-4`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
          {file && (
            <p className="text-sm mt-1">Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}