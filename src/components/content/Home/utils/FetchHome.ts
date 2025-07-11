import { HomeContentProps } from "@/components/content/Home/types/home";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_HOME}`;

export const fetchHomeContents = async (): Promise<HomeContentProps[]> => {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch home contents: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home contents:", error);
    throw error;
  }
};
