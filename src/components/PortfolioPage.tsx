import React from "react";
/*
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
*/

import Navbar from "@/components/Navbar";
import UserSection from "./UserSection";
import PortfolioOverview from "./PortfolioOverview";
import HoldingsChart from "./HoldingsChart";
//import ValueOverTimeChart from "./ValueOverTimeChart";
//import PLPercentageChart from "./PLPercentageChart";
import QuickActionsCard from "./QuickActionsCard";
import InsightsCard from "./InsightsCard";
import HoldingsTable from "./HoldingsTable";
import { getAllTransactions, getHoldings } from "@/app/actions/userHoldings.action";
import { getStockPriceData } from "@/app/actions/Livestock.action";
import { Holding, Transaction } from "@/types/holdings";

//ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const dummyUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: ""
};



const createHoldings = async (): Promise<Holding[]> => {
  const holdings = await getHoldings();
  const priceObject = await getStockPriceData(holdings.map((code) => code.stockCode))
  const merged = holdings.map(code => {
    const priceData = priceObject.find(p => p.stockCode === code.stockCode)
    return {...code, price: priceData?.price}
  })
  return merged;
}

const PortfolioPage = async () => {
  //Get User Holdings from data base
  const holdings = await createHoldings();
  const transactionData = await getAllTransactions();

  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserSection user={dummyUser} />
          <PortfolioOverview holdings={holdings} />
          <QuickActionsCard />
          <InsightsCard />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <HoldingsTable holdings={holdings} transactions={transactionData} />
          {/*<HoldingsChart holdings={dummyHoldings} />*/}
          {/*
          <ValueOverTimeChart />
          <PLPercentageChart />*/}
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
