import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the auth token from the request headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.error('No authorization header found');
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract the token value without any prefix
    const token = authHeader.replace(/^(Bearer|Authorization=|SHA256)\s+/, '');

    // Get the agency ID from query params
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agency_id');

    // Make the API request
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/policies/${params.id}`);
    if (agencyId) {
      apiUrl.searchParams.set('agency_id', agencyId);
    }

    console.log('Making API request to:', apiUrl.toString());
    console.log('Using authorization header:', 'SHA256 <token-hidden>');
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Authorization': `SHA256 ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl.toString(),
      });

      // Log the response body for debugging
      try {
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
      } catch (e) {
        console.error('Failed to read error response body');
      }

      // If the API returns a 401 or 403, we should return a more specific error
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { message: 'Authentication failed - invalid or expired token' },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { message: 'Failed to fetch policy' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in policy API route:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 