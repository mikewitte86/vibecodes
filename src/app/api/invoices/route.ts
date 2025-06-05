import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Debug environment variables
    console.log('Environment variables:', {
      hasToken: !!process.env.ASCEND_API_TOKEN,
      tokenStart: process.env.ASCEND_API_TOKEN?.substring(0, 5),
      envKeys: Object.keys(process.env).filter(key => key.includes('ASCEND')),
    });

    const token = process.env.ASCEND_API_TOKEN;
    if (!token) {
      console.error('No API token found in environment variables');
      return NextResponse.json(
        { message: 'API token not configured' },
        { status: 500 }
      );
    }

    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    
    // Build API URL with supported query parameters
    const apiUrl = new URL('https://api.useascend.com/v1/invoices');
    
    // Copy supported query parameters
    const supportedParams = [
      'page',
      'per_page',
      'program_id',
      'billable_id',
      'insured_id',
      'product_type',
      'due_date_start',
      'due_date_end',
      'paid_at_start',
      'paid_at_end'
    ];

    // Handle program_id[] array parameter separately
    const programIds = searchParams.getAll('program_id[]');
    programIds.forEach(id => {
      apiUrl.searchParams.append('program_id[]', id);
    });

    // Copy other supported parameters
    supportedParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        apiUrl.searchParams.set(param, value);
      }
    });

    // Ensure page parameter has a default
    if (!apiUrl.searchParams.has('page')) {
      apiUrl.searchParams.set('page', '1');
    }

    // Ensure per_page parameter has a default
    if (!apiUrl.searchParams.has('per_page')) {
      apiUrl.searchParams.set('per_page', '50');
    }

    console.log('Making API request to:', apiUrl.toString());
    console.log('Query parameters:', Object.fromEntries(apiUrl.searchParams.entries()));
    console.log('Using authorization:', `Bearer ${token.substring(0, 5)}...`);
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      try {
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
      } catch (e) {
        console.error('Failed to read error response body');
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { message: 'Authentication failed - please check API token' },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { message: 'Failed to fetch invoices' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Response structure:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in invoices API route:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 