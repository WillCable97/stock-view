
/**import React from 'react'
import EditStockDialog from '../EditStockDialog';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';

type Stock = {
    price: any;
    stockCode: string;
    quantity: number;
    avgBuyPrice: number;
}
export const HoldingActionButtons = (inputStock: Stock) => {
  return (
    <>
        <EditStockDialog stock={inputStock}>
            <Button size="icon" variant="ghost">
                <Edit className="w-4 h-4" />
            </Button>
        </EditStockDialog>
        <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
    </>
  )
}

 * 
 * 
  const handleOpen = async () => {
    // Only fetch if not already loaded or always fetch if needed
    try {
      const res = await fetch(`/api/stock/transactions?stock=${stock.symbol}`);
      const data = await res.json();
      setTransactions(data);
      setOpen(true); // Open dialog after data is fetched
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <>
      <Button size="icon" variant="ghost" onClick={handleOpen}>
        <Edit className="w-4 h-4" />
      </Button>

      {open && transactions && (
        <EditStockDialog
          stock={stock}
          transactions={transactions}
          onClose={() => setOpen(false)}
        />
      )}
    </>
 */
