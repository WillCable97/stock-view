import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";




const PortfolioOverview = ({ holdings }: { holdings: typeof dummyHoldings }) => {
    const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
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