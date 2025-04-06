import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Holding } from "@/types/holdings";

/*
const dummyHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 145.12, currentPrice: 155.90 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 30, avgPrice: 650.50, currentPrice: 720.34 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 10, avgPrice: 3100.00, currentPrice: 3275.88 }
];
*/
/*
'Holding' is declared but its value is never read.ts(6133)
Ctrl+click to open in new tab
(alias) type Holding = {
    stockCode: string;
    quantity: number;
    avgBuyPrice: number;
    price: number;
}
*/

const PortfolioOverview = ({ holdings }: { holdings: Holding[] }) => {
    const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.quantity * h.price, 0);
    const pl = currentValue - totalInvested;
  
    return (
      <Card className="bg-zinc-800 text-white">
        <CardHeader><CardTitle>Portfolio Overview</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-zinc-400">Total Invested</p>
            <p className="text-lg font-semibold">${totalInvested.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Current Value</p>
            <p className="text-lg font-semibold">${currentValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">P/L</p>
            <p className={`text-lg font-semibold ${pl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {pl >= 0 ? "+" : ""}${pl.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

export default PortfolioOverview;