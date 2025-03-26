"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { DialogFooter } from "./ui/dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "./ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";

const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 145.12, currentPrice: 155.90 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 30, avgPrice: 650.50, currentPrice: 720.34 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 10, avgPrice: 3100.00, currentPrice: 3275.88 }
];




const HoldingsTable = () => {
    const [filter, setFilter] = useState("");
  
    const filtered = holdings.filter(h =>
      h.symbol.toLowerCase().includes(filter.toLowerCase())
    );
  
    return (
      <Card className="bg-zinc-800 text-white w-full">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <Input
              placeholder="Filter by symbol"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs bg-zinc-900 text-white border-zinc-700"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <PlusCircle className="h-4 w-4" /> Add Holding
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 text-white">
                <DialogTitle>Add New Holding</DialogTitle>
                <div className="grid gap-4 py-4">[Form goes here]</div>
                <DialogFooter>
                  <Button type="submit" variant="secondary">Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => {
                const pl = (h.currentPrice - h.avgPrice) * h.shares;
                return (
                  <TableRow key={h.symbol}>
                    <TableCell>{h.symbol}</TableCell>
                    <TableCell>{h.name}</TableCell>
                    <TableCell>{h.shares}</TableCell>
                    <TableCell>${h.avgPrice.toFixed(2)}</TableCell>
                    <TableCell>${h.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className={pl >= 0 ? "text-green-400" : "text-red-400"}>
                      {pl >= 0 ? "+" : ""}${pl.toFixed(2)}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
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