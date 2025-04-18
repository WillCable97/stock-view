"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Save, X } from "lucide-react";
import { getAllTransactions } from "@/app/actions/userHoldings.action";



type Props = {
  stock: {
    symbol: string;
    newStock: boolean;
  };
  children: React.ReactNode;
};



const  EditStockDialog = ({ newStock = false, stock= "", children }: Props) => {
  const [open, setOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState(false);
  const [form, setForm] = useState({ date: "", shares: "", price: "" });

  const myTrans = await getAllTransactions();
  
  const [transactions, setTransactions] = useState<Transaction[]>(myTrans[stock.symbol] || []);

  const handleSave = (id: number) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, ...form, shares: +form.shares, price: +form.price } : t
    ));
    setEditingId(null);
    setForm({ date: "", shares: "", price: "" });
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAdd = () => {
    const nextId = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    setTransactions([...transactions, {
      id: nextId,
      date: form.date,
      shares: +form.shares,
      price: +form.price
    }]);
    setNewRow(false);
    setForm({ date: "", shares: "", price: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>{newStock ? "Add Holding" : `Edit Transactions - ${stock.stockCode}`}</DialogTitle>
          {
            newStock ? <Input placeholder="Stock Symbol" className="max-w-xs bg-zinc-900 text-white border-zinc-700" /> 
            : <></>
          }
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="!text-white">Date</TableHead>
              <TableHead className="!text-white">Shares</TableHead>
              <TableHead className="!text-white">Price</TableHead>
              <TableHead className="!text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                {/**DATE FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    : t.date}
                </TableCell>
                {/**QUANTITY FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Input value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} />
                    : t.shares}
                </TableCell>
                {/**PRICE FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    : `$${t.price.toFixed(2)}`}
                </TableCell>
                {/**EDIT / DELETE BUTTONS */}
                <TableCell className="flex gap-2">
                  {editingId === t.id ? (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => handleSave(t.id)}><Save className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setEditingId(t.id);
                        setForm({ date: t.date, shares: t.shares.toString(), price: t.price.toString() });
                      }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4" /></Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {newRow && (
              <TableRow>
                <TableCell><Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></TableCell>
                <TableCell><Input value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} /></TableCell>
                <TableCell><Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleAdd}><Save className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => {
                    setNewRow(false);
                    setForm({ date: "", shares: "", price: "" });
                  }}><X className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DialogFooter className="mt-4">
          {!newRow && (
            <Button variant="secondary" onClick={() => setNewRow(true)}>Add Transaction</Button>
          )}
          <Button variant="secondary" onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;
