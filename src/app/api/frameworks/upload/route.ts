import { NextResponse } from "next/server";
import imagekit from "@/utils/imgkit/imagekit";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit in frameworks folder
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/frameworks",
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error("Error uploading framework image:", error);
    return NextResponse.json(
      { error: "Failed to upload framework image" },
      { status: 500 }
    );
  }
}
