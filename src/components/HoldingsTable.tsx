import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "./ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import EditStockDialog from "./EditStockDialog";
import { AddHoldingButon } from "./ChildComponents/AddHoldingButon";
import { getHoldings } from "@/app/actions/userHoldings.action";
import { getStockPriceData } from "@/app/actions/Livestock.action";

/*const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 145.12, currentPrice: 155.90 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 30, avgPrice: 650.50, currentPrice: 720.34 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 10, avgPrice: 3100.00, currentPrice: 3275.88 }
];*/




const HoldingsTable = async () => {
  //Get User Holdings from data base
  const holdings = await getHoldings();

  //Get Current stock prices for held stock
  const priceObject = await getStockPriceData(holdings.map((code) => code.stockCode))

  //Make a combined object
  const merged = holdings.map(code => {
    const priceData = priceObject.find(p => p.stockCode === code.stockCode)
    return {...code, price: priceData?.price}
  })
  
  
  //console.log(holdingInt);
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
              {/*
              <Button size="icon" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
              </EditStockDialog>
            <AddHoldingButon />*/}
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
              {merged.map((h) => {
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
                      <EditStockDialog stock={h}>
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