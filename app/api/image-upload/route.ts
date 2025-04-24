import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

cloudinary.config({ 
    cloud_name:process.env.Next_Public_Cloudinary_Cloud_Name,
    api_key:process.env.Cloudinary_Api_Key,
    api_secret: process.env.Cloudinary_Api_Secret
});

    interface CloudinaryUploadResult {
        public_id: string;
        [key: string]: any;
    }

    export async function POST(req: NextRequest) {
        const {userId} = await auth();

        if(!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
        try {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            if(!file) {
                return NextResponse.json({error: 'No file found'}, {status: 400});
                    }
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const result =await new Promise<CloudinaryUploadResult>(
                (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream( { folder:"next-cloudinary-saas"}, (error, result) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                });
                uploadStream.end(buffer);
                });
            
                return NextResponse.json(
                    {publicId: result.public_id},
                    {status: 200}
                );
           
                
            
        } catch (error) {
            console.log(error);
            return NextResponse.json({error: error}, {status: 500});
            
        }

    }

