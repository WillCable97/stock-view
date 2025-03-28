"use client";

import React from 'react'
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from "lucide-react"; 


export default function StockSearch() {
    const [stockCode, setStockCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const stockCodeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStockCode(e.target.value);
    }
    const handleNewStock = async () => {
        return 
        /*
        if (!stockCode.trim()) return; // Validate input
        setIsLoading(true); // Disable button and show spinner
        await addHolding(stockCode);
        setStockCode("");
        setIsLoading(false); // Re-enable button after processing
        */
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleNewStock();
        }
    };

    return (
                <div className="flex gap-2 mb-4">
                    <Input placeholder="Sotck Code" className="flex-1 bg-gray-700 text-white border-none" 
                        value={stockCode} 
                        onChange={stockCodeHandler} 
                        onKeyDown={handleKeyDown} 
                        disabled={isLoading} 
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" 
                        onClick={handleNewStock}
                        disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Add Holding"}
                    </Button>
                </div>
    )
}
/*

  type TransactionInput = {
    stockCode: string;
    exchange: string;
    date: Date;
    quantity: number;
    price: number;
    type: 'BUY' | 'SELL';
  };*/