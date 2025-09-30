import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    


    // Proxy the request to the actual auth API
    const authApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/create-account`;
    

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
    console.log('Auth API response:', authResponse);

    return NextResponse.json(authResponse);

  } catch (error) {
    console.error('Create Account Proxy Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create account',
        status: 'error'
      },
      { status: 500 }
    );
  }
}

