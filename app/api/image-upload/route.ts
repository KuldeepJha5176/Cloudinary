import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Add file size validation
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    // Log file information for debugging
    console.log(
      `Upload attempt - Type: ${file.type}, Size: ${file.size}, Name: ${file.name}`
    );

    // Check if it's an image based on MIME type OR file extension
    const validImageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".tiff",
      ".heic",
      ".heif",
    ];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validImageExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!file.type.startsWith("image/") && !hasValidExtension) {
      return NextResponse.json(
        {
          error: `File doesn't appear to be an image. Please try a different file.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Let Cloudinary handle validation and processing
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            resource_type: "auto", // Let Cloudinary detect and handle the resource type
            allowed_formats: [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "webp",
              "bmp",
              "heic",
              "heif",
              "tiff",
              "svg",
            ], // Optional: specify allowed formats
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        publicId: result.public_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Upload image failed", error);

    // Check if it's a Cloudinary error with a specific message
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Upload failed. Please try a different image or format.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
