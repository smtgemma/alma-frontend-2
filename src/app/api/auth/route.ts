import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/auth', '');


    // Proxy the request to the actual auth API
    const authApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth${path}`;
    

    const response = await fetch(authApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Auth API error:', response.status, response.statusText, errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || `Auth API error: ${response.status} ${response.statusText}`,
          status: 'error',
          data: errorData
        },
        { status: response.status }
      );
    }

    const authResponse = await response.json();

    return NextResponse.json(authResponse);

  } catch (error) {
    console.error('Auth Proxy Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process auth request',
        status: 'error'
      },
      { status: 500 }
    );
  }
}

