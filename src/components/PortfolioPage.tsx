import React from "react";
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


import Navbar from "@/components/Navbar";
import UserSection from "./UserSection";
import PortfolioOverview from "./PortfolioOverview";
import HoldingsChart from "./HoldingsChart";
import ValueOverTimeChart from "./ValueOverTimeChart";
import PLPercentageChart from "./PLPercentageChart";
import QuickActionsCard from "./QuickActionsCard";
import InsightsCard from "./InsightsCard";
import HoldingsTable from "./HoldingsTable";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const dummyUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: ""
};

const dummyHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 145.12, currentPrice: 155.90 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 30, avgPrice: 650.50, currentPrice: 720.34 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 10, avgPrice: 3100.00, currentPrice: 3275.88 }
];

const PortfolioPage = async () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserSection user={dummyUser} />
          <PortfolioOverview holdings={dummyHoldings} />
          <QuickActionsCard />
          <InsightsCard />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <HoldingsTable />
          <HoldingsChart holdings={dummyHoldings} />
          <ValueOverTimeChart />
          <PLPercentageChart />
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
