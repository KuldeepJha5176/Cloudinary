import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const video = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(video);
    } catch (error) {
            return NextResponse.json(error);
    }
        finally {
           await prisma.$disconnect();
        }
}