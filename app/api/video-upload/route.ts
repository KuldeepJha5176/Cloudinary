import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/app/generated/prisma';


const prisma = new PrismaClient();


cloudinary.config({ 
    cloud_name:process.env.Next_Public_Cloudinary_Cloud_Name,
    api_key:process.env.Cloudinary_Api_Key,
    api_secret: process.env.Cloudinary_Api_Secret
});

    interface CloudinaryUploadResult {
        public_id: string;
        [key: string]: any;
        bytes: number;
        duration?: number;

    }

    export async function POST(req: NextRequest) {
       

        try {

             //CHECK THE  USER
        const {userId} = await auth();

        if(!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
        //CHECK THE ENV VARIABLES
        if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET 
            
        ){
            return NextResponse.json({error: 'Missing Cloudinary Credentials'}, {status: 500});
        }
        

            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            const title = formData.get('title') as string ;
            const description = formData.get('description') as string | null;
            const duration = formData.get('duration') as string | null;
            const originalSize = formData.get('originalSize') as string ;

            if(!file) {
                return NextResponse.json({error: 'No file found'}, {status: 400});
                    }
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const result =await new Promise<CloudinaryUploadResult>(
                (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream( { resource_type: "video",folder:"video-upload-cloudinary-saas",
                    transformation: [
                        {quality: 'auto',fetch_format: 'mp4'}, 


                    ]
                }, (error, result) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                });
                uploadStream.end(buffer);
                });
                const video = await prisma.video.create({
                    data: {
                        title: title,
                        description: description,
                        publicId: result.public_id,
                        originalSize: originalSize,
                        compressedSize: String(result.bytes),
                        duration: result.duration || 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
            
                    }
                });
                return NextResponse.json(video);
        } catch (error) {
            console.log(error);
            return NextResponse.json({error: error}, {status: 500});
            
        }
        finally {
           await prisma.$disconnect();
        }

    }

