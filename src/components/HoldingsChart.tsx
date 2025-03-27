"use client" 

import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const HoldingsChart = ({ holdings }: { holdings: typeof dummyHoldings }) => {
    const data = {
      labels: holdings.map(h => h.name),
      datasets: [{
        label: "Current Value",
        data: holdings.map(h => h.shares * h.currentPrice),
        backgroundColor: "rgba(34,197,94,0.6)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 1
      }]
    };
  
    return (
      <Card className="bg-zinc-800 text-white w-full">
        <CardHeader><CardTitle>Current Holdings Value</CardTitle></CardHeader>
        <CardContent><Bar data={data} /></CardContent>
      </Card>
    );
  };

  export default HoldingsChart;