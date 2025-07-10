import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();
    
    // Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Here you would typically:
    // 1. Send email to your email address
    // 2. Save to database
    // 3. Send to external service (e.g., SendGrid, Mailgun)
    
    // For now, we'll just log it and return success
    console.log('Contact form submission:', { email, message, timestamp: new Date().toISOString() });
    
    // TODO: Implement actual email sending logic
    // Example with nodemailer, sendgrid, etc.
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 