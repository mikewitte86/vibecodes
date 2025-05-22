import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { USER_ROLES_TYPES } from "@/enums";

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

const getAuthToken = async () => {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  
  if (!token) {
    throw new Error("Unauthorized");
  }
  
  return token;
};

const handleApiError = (error: unknown, defaultMessage: string) => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  return NextResponse.json({ error: errorMessage }, { status: 500 });
};

export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const paginationToken = searchParams.get("pagination_token");

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    apiUrl.searchParams.set("limit", limit);
    if (paginationToken) {
      apiUrl.searchParams.set("pagination_token", paginationToken);
    }

    const response = await fetch(apiUrl.toString(), {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return NextResponse.json(data.body);
  } catch (error) {
    return handleApiError(error, "Failed to fetch users");
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();
    const body = await request.json();
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users`);

    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, "Failed to create user");
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();

    if (!body.name || !body.user_role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (body.user_role === USER_ROLES_TYPES.AGENCY_ADMIN && !body.agency_id) {
      return NextResponse.json({ error: "Agency is required for Agency Admin role" }, { status: 400 });
    }

    const requestBody = {
      username: userId,
      name: body.name.trim(),
      user_role: body.user_role.toUpperCase(),
      enabled: body.enabled ?? true,
      ...(body.agency_id && { agency_id: body.agency_id.toLowerCase() })
    };

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(userId)}`);

    const response = await fetch(apiUrl.toString(), {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to update user" }));
      return NextResponse.json({ error: errorData.error || "Failed to update user" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, "Failed to update user");
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);

    const response = await fetch(apiUrl.toString(), {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return handleApiError(error, "Failed to delete user");
  }
}
