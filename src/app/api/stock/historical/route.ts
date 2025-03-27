import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbols');
  const period = searchParams.get('period');

  if (!symbol || !period) {
    return NextResponse.json({ error: 'Stock symbol and period are required' }, { status: 400 });
  }

  // Decide interval based on the period
  let interval = '1d';
  switch (period) {
    case 'daily':
      interval = '1d';
      break;
    case 'weekly':
      interval = '1wk';
      break;
    case 'monthly':
      interval = '1mo';
      break;
    case 'yearly':
      interval = '3mo';
      break;
    default:
      return NextResponse.json({ error: 'Invalid period value' }, { status: 400 });
  }

  const endpoint = `${BACKEND_URL}/historical?symbol=${symbol}&interval=${interval}&range=${period}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
