"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Save, X } from "lucide-react";
import { refreshPortfolio } from "@/app/actions/userHoldings.action";
import { Holding, Transaction } from "@/types/holdings";



type NewTransaction = {
  id: number;
  date: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
  newFlag: boolean;
  deleteFlag: boolean;
  updateFlag: boolean;
};

type Props = {
  newStock?: boolean;
  stock?: Holding | null;
  inputTransactions?: Transaction[] | null;
  children: React.ReactNode;
};

const  EditStockDialog =  ({ newStock = false, stock= null, inputTransactions = null, children }: Props) => {
  const [open, setOpen] = useState(false);
  

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState(false);
  const [form, setForm] = useState({ date: "", type: "", quantity: "", price: "" });

  const [secCode, setSecCode] = useState (stock?.stockCode || '')

  //Keeping track of transaction changes
  const [deletedTrans, setDeletedTrans] = useState<NewTransaction[]>([])
  //Initializing the transactions with flags to track changes
  const flaggedTransactions = inputTransactions ? inputTransactions.map(transaction => ({...transaction, newFlag: false, deleteFlag: false, updateFlag: false})) : []
  const [transactions, setTransactions] = useState<NewTransaction[]>(flaggedTransactions);

  //Base ID for new transactions
  const idBase = inputTransactions ? Math.max(...inputTransactions.map(t => t.id)) + 1 : 1 

  const handleNewTransaction = () => {
    const candidateId = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1
    const nextId = Math.max(idBase, candidateId) //Never reuse an existing ID, and never use an ID in the range of examples given (prevents reuse of ID after deletionc)

    setTransactions([...transactions, {
      id: nextId,
      date: form.date,
      quantity: +form.quantity,
      price: +form.price,
      type: form.type as 'BUY' | 'SELL',
      newFlag: true,
      deleteFlag: false,
      updateFlag: false
    }]);
    setNewRow(false);
    setForm({ date: "", type: "", quantity: "", price: "" });
  };

  const handleSave = (id: number) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, ...form, quantity: +form.quantity, price: +form.price, type: form.type==="BUY" ? "BUY":"SELL", date:form.date } : t
    ));
    setEditingId(null);
    setForm({ date: "", type: "", quantity: "", price: "" });
  };
  
  const handleDelete = (id: number) => {

    setTransactions(transactions.filter(t => {
      if(t.id===id){
        if(!t.newFlag){
          setDeletedTrans([...deletedTrans, {...t, deleteFlag: true}])
        }
        return false;
      }
      return true;
    }))
  };

  const handledone = async () => {
    const totalTransactionChange = deletedTrans ? transactions.concat(deletedTrans) : transactions

    setOpen(false)

    
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: totalTransactionChange,
        exchange: 'ASX',
        stockCode: secCode
      }),
    });
  
    const result = await res.json();
    console.log(result);
    
    // Refresh the portfolio data
    await refreshPortfolio();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>{newStock ? "Add Holding" : `Edit Transactions - ${stock?.stockCode}`}</DialogTitle>
          {
            newStock ? <Input placeholder="Stock Symbol" value={secCode} onChange={e => setSecCode(e.target.value)} className="max-w-xs bg-zinc-900 text-white border-zinc-700" /> 
            : <></>
          }
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="!text-white">Date</TableHead>
              <TableHead className="!text-white">Buy/Sell</TableHead>
              <TableHead className="!text-white">Shares</TableHead>
              <TableHead className="!text-white">Price</TableHead>
              <TableHead className="!text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              return(
              <TableRow key={t.id}>
                {/**DATE FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Input type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    : t.date}
                </TableCell>
                {/**BUY / SELL FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Select value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                    >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">BUY</SelectItem>
                      <SelectItem value="SELL">SELL</SelectItem>
                    </SelectContent>
                  </Select>
                    : t.type}
                </TableCell>
                {/**QUANTITY FIELD */}
                <TableCell>
                  {editingId === t.id
                    ? <Input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                    : t.quantity}
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
                        setForm({ date: t.date, type: t.type, quantity: t.quantity.toString(), price: t.price.toString() });
                      }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4" /></Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            )})}
            {/**NEW ROW ADDED */}
            {newRow && (
              <TableRow>
                <TableCell><Input value={form.date} type="date" onChange={e => setForm({ ...form, date: e.target.value })} /></TableCell>
                <TableCell>
                  <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                  </Select>
                </TableCell>

                <TableCell><Input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></TableCell>
                <TableCell><Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleNewTransaction}><Save className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => {
                    setNewRow(false);
                    setForm({ date: "", type:"", quantity: "", price: "" });
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
          <Button variant="secondary" onClick={() => handledone()}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;
