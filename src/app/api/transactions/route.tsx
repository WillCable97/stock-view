// app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { processTransactions } from '@/app/actions/userHoldings.action'; // wherever the function lives

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Add validation here if needed
    if (!Array.isArray(data.transactions)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await processTransactions(data.transactions, data.exchange, data.stockCode);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

