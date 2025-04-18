import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "./ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import EditStockDialog from "./EditStockDialog";
import { Holding, Transaction } from "@/types/holdings";

type Props = {
  holdings: Holding[];
  transactions: Record<string, Transaction[]>;
}

const HoldingsTable = async ({holdings, transactions}: Props) => {

  return (
    <Card className="bg-zinc-800 text-white w-full">
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <Input placeholder="Filter by symbol" className="max-w-xs bg-zinc-900 text-white border-zinc-700" />
          <EditStockDialog newStock = {true}>
            <Button variant="secondary" className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Holding
            </Button>
          </EditStockDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
          <TableRow >
              <TableHead className=" !text-white">Symbol</TableHead>
              <TableHead className=" !text-white">Company</TableHead>
              <TableHead className=" !text-white">Shares</TableHead>
              <TableHead className=" !text-white">Avg Price</TableHead>
              <TableHead className=" !text-white">Current Price</TableHead>
              <TableHead className=" !text-white">P/L</TableHead>
              <TableHead className=" !text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((h) => {
              const pl = (h.price - h.avgBuyPrice) * h.quantity;
              return (
                <TableRow key={h.stockCode}>
                  <TableCell>{h.stockCode}</TableCell>
                  <TableCell>{"ABCC"}</TableCell>
                  <TableCell>{h.quantity}</TableCell>
                  <TableCell>${h.avgBuyPrice.toFixed(2)}</TableCell>
                  <TableCell>${h.price.toFixed(2)}</TableCell>
                  <TableCell className={pl >= 0 ? "text-green-400" : "text-red-400"}>
                    {pl >= 0 ? "+" : ""}${pl.toFixed(2)}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <EditStockDialog stock={h} inputTransactions={transactions[h.stockCode]}>
                      <Button size="icon" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </EditStockDialog>
                    <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
  };

  export default HoldingsTable;