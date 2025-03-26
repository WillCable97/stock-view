import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const dummyHistory = [
  { date: "2024-12-01", value: 54000, plPercent: 2.1 },
  { date: "2024-12-15", value: 55500, plPercent: 2.7 },
  { date: "2025-01-01", value: 58200, plPercent: 4.8 },
  { date: "2025-01-15", value: 57100, plPercent: 4.1 },
  { date: "2025-02-01", value: 58950, plPercent: 5.6 }
];

const PLPercentageChart = () => {
    const data = {
      labels: dummyHistory.map(e => e.date),
      datasets: [{
        label: "P/L % Over Time",
        data: dummyHistory.map(e => e.plPercent),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
        fill: true
      }]
    };
    return (
      <Card className="bg-zinc-800 text-white w-full">
        <CardHeader><CardTitle>Profit/Loss % Over Time</CardTitle></CardHeader>
        <CardContent><Line data={data} /></CardContent>
      </Card>
    );
  };

export default PLPercentageChart;