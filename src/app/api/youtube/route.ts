import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb/mongodb";
import { revalidateSitemap } from "@/utils/sitemap";
import Youtube from "@/models/youtube";

interface FrameworkData {
  title: string;
  imageUrl: string;
}

// GET all YouTube content
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const youtubeContent = await Youtube.find().sort({ createdAt: -1 });
    return NextResponse.json(youtubeContent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch YouTube content" },
      { status: 500 }
    );
  }
}

// POST new YouTube content
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    // Validate frameworks data
    if (!Array.isArray(body.frameworks)) {
      return NextResponse.json(
        { error: "Frameworks must be an array" },
        { status: 400 }
      );
    }

    // Create new YouTube content with frameworks
    const youtubeData = {
      title: body.title,
      description: body.description,
      content: body.content,
      category: body.category,
      thumbnail: body.thumbnail,
      href: body.href,
      frameworks: body.frameworks.map((framework: FrameworkData) => ({
        title: framework.title,
        imageUrl: framework.imageUrl,
      })),
    };

    // Create and save the document
    const newYoutube = new Youtube(youtubeData);
    const savedYoutube = await newYoutube.save();

    // Revalidate sitemap after successful creation
    await revalidateSitemap();

    return NextResponse.json(savedYoutube, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create YouTube content",
      },
      { status: 500 }
    );
  }
}

// PUT update YouTube content
export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedYoutube = await Youtube.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedYoutube) {
      return NextResponse.json(
        { error: "YouTube content not found" },
        { status: 404 }
      );
    }

    // Revalidate sitemap after successful update
    await revalidateSitemap();

    return NextResponse.json(updatedYoutube);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update YouTube content" },
      { status: 500 }
    );
  }
}

// DELETE YouTube content
export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedYoutube = await Youtube.findByIdAndDelete(id);

    if (!deletedYoutube) {
      return NextResponse.json(
        { error: "YouTube content not found" },
        { status: 404 }
      );
    }

    // Revalidate sitemap after successful deletion
    await revalidateSitemap();

    return NextResponse.json({
      message: "YouTube content deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete YouTube content" },
      { status: 500 }
    );
  }
}
