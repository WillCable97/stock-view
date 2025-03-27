import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import React from 'react'
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import { DialogFooter } from '../ui/dialog'

export const AddHoldingButon = () => {
  return (
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
  )
}
