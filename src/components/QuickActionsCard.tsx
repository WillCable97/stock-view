import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const QuickActionsCard = () => (
  <Card className="bg-zinc-800 text-white w-full">
    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
    <CardContent className="flex gap-4 flex-wrap">
      <Button variant="secondary">Add Funds</Button>
      <Button variant="secondary">Export Report</Button>
      <Button variant="secondary">Rebalance</Button>
    </CardContent>
  </Card>
);

export default QuickActionsCard;