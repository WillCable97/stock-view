import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";


const InsightsCard = () => (
    <Card className="bg-zinc-800 text-white w-full">
      <CardHeader><CardTitle>Investment Insights</CardTitle></CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Apple continues to outperform average price by 7.4%.</li>
          <li>Tesla has shown 10% growth since your average purchase.</li>
          <li>Amazon remains stable but highly priced, consider watching market trends.</li>
        </ul>
      </CardContent>
    </Card>
  );

export default InsightsCard;