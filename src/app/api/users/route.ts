import { NextResponse } from "next/server";
import { headers } from "next/headers";

interface ApiResponse {
  statusCode: number;
  body: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      user_role: string;
      agency_id: string;
      status: string;
      last_modified: string;
    }>;
    count: number;
    pagination_token?: string;
  };
}

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const paginationToken = searchParams.get("pagination_token");

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    apiUrl.searchParams.set("limit", limit);
    if (paginationToken) {
      apiUrl.searchParams.set("pagination_token", paginationToken);
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return NextResponse.json(data.body);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json(
      { error: "Failed to fetch users", details: errorMessage },
      { status: 500 },
    );
  }
}
