"use server";

import { prisma } from "@/lib/prisma";
//import { revalidatePath } from "next/cache";
import { revalidatePath, revalidateTag } from "next/cache";
import { getUserId } from "./user.action";

// Add tags for selective revalidation
//export const HOLDINGS_TAG = 'holdings';
//export const TRANSACTIONS_TAG = 'transactions';

// Add this new function to refresh holdings data
/*
export async function refreshHoldings() {
  revalidateTag(HOLDINGS_TAG);
  revalidateTag(TRANSACTIONS_TAG);
}
*/

/*********************GET USER HOLDINGS FLOW********************** */
export async function getHoldings(): Promise<{ stockCode: string, quantity: number, avgBuyPrice: number }[]> {
    try {
      const userId = await getUserId(); // Assuming this returns the logged-in user's ID
  
      const holdings = await prisma.userHolding.findMany({
        where: {
          userId: userId,
        },
        select: {
          security: {
            select: {
              stockCode: true,
            },
          },
          quantity: true, 
          avgBuyPrice: true 
        }
      });
  
      // Flatten the nested result to just stockCode
      return holdings.map(h => ({ stockCode: h.security.stockCode, quantity: h.quantity, avgBuyPrice: h.avgBuyPrice ?? 0 }));
  
    } catch (error) {
      console.error("Error fetching holdings:", error);
      return [];
    }
  }



type Transaction = {
  id: number;
  date: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL'; // Include transaction type
};

type TransactionsByStock = Record<string, Transaction[]>;

export async function getAllTransactions(): Promise<TransactionsByStock> {
  const userId = await getUserId();

  const transactions = await prisma.stockTransaction.findMany({
    where: { userId },
    include: {
      security: true,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  const grouped: TransactionsByStock = {};

  for (const tx of transactions) {
    const code = tx.security.stockCode;

    if (!grouped[code]) {
      grouped[code] = [];
    }

    grouped[code].push({
      id: tx.id,
      date: tx.timestamp.toISOString().split('T')[0], // format as YYYY-MM-DD
      quantity: tx.quantity,
      price: tx.price,
      type: tx.type,
    });
  }

  return grouped;
}





export async function refreshPortfolio() {
  revalidatePath('/portfolio');
}


/*
[
    {
        "id": 1,
        "date": "2025-03-28",
        "quantity": 10,
        "price": 50,
        "type": "BUY",
        "stockCode": "VGS",
        "newFlag": false,
        "deleteFlag": false,
        "updateFlag": false
    },
    {
        "id": 2,
        "date": "2025-02-25",
        "quantity": 5,
        "price": 7,
        "type": "BUY",
        "newFlag": true,
        "stockCode": "VGS",
        "deleteFlag": false,
        "updateFlag": false
    }
]
*/


  interface TransactionInput {
    id: number;
    date: Date;
    quantity: number;
    price: number;
    type: 'BUY' | 'SELL';
    newFlag: boolean;
    deleteFlag: boolean;
    updateFlag: boolean;
  }
  
  export async function processTransactions(transactions: TransactionInput[], exchange: string, stockcode: string) {

    const userId = await getUserId();
  
    for (const tx of transactions) {
      // 1. Create or find Security
      const security = await prisma.security.upsert({
        where: {
          stockCode_exchange: {
            stockCode: stockcode,
            exchange: exchange,
          },
        },
        update: {},
        create: {
          stockCode: stockcode,
          exchange: exchange,
        },
      });
  
      // DELETE TRANSACTION
      if (tx.deleteFlag) {
        await prisma.stockTransaction.delete({
          where: { id: tx.id },
        });
        // Optionally, update holdings after delete
        await updateUserHolding(userId, security.id);
        continue;
      }
  
      // CREATE NEW TRANSACTION
      if (tx.newFlag) {
        await prisma.stockTransaction.create({
          data: {
            userId,
            securityId: security.id,
            type: tx.type,
            quantity: tx.quantity,
            price: tx.price,
            timestamp: new Date(tx.date),
          },
        });
        await updateUserHolding(userId, security.id);
        continue;
      }
  
      // UPDATE EXISTING TRANSACTION
      if (tx.updateFlag) {
        await prisma.stockTransaction.update({
          where: { id: tx.id },
          data: {
            type: tx.type,
            quantity: tx.quantity,
            price: tx.price,
            timestamp: new Date(tx.date),
          },
        });
        await updateUserHolding(userId, security.id);
        continue;
      }
    }
  }
  
  async function updateUserHolding(userId: number, securityId: number) {
    // Get all BUY transactions to recalculate quantity and avg price
    const transactions = await prisma.stockTransaction.findMany({
      where: {
        userId,
        securityId,
      },
    });
  
    let quantity = 0;
    let totalCost = 0;
  
    for (const tx of transactions) {
      if (tx.type === 'BUY') {
        quantity += tx.quantity;
        totalCost += tx.quantity * tx.price;
      } else if (tx.type === 'SELL') {
        quantity -= tx.quantity;
      }
    }
  
    const avgBuyPrice = quantity > 0 ? totalCost / quantity : null;
  
    await prisma.userHolding.upsert({
      where: {
        userId_securityId: {
          userId,
          securityId,
        },
      },
      update: {
        quantity,
        avgBuyPrice,
      },
      create: {
        userId,
        securityId,
        quantity,
        avgBuyPrice,
      },
    });
  }



































  /*




  type TransactionInput = {
    stockCode: string;
    exchange: string;
    date: Date;
    quantity: number;
    price: number;
    type: 'BUY' | 'SELL';
  };


  export async function processTransaction(input: TransactionInput) {
    const userId = await getUserId();
  
    // Step 1: Ensure Security exists
    let security = await prisma.security.findUnique({
      where: {
        stockCode_exchange: {
          stockCode: input.stockCode,
          exchange: input.exchange,
        },
      },
    });
  
    if (!security) {
      security = await prisma.security.create({
        data: {
          stockCode: input.stockCode,
          exchange: input.exchange,
        },
      });
    }
  
    // Step 2: Create the Transaction
    await prisma.stockTransaction.create({
      data: {
        userId,
        securityId: security.id,
        type: input.type,
        quantity: input.quantity,
        price: input.price,
        timestamp: input.date,
      },
    });
  
    // Step 3: Update User Holdings
    const existingHolding = await prisma.userHolding.findUnique({
      where: {
        userId_securityId: {
          userId,
          securityId: security.id,
        },
      },
    });
  
    if (input.type === 'BUY') {
      if (!existingHolding) {
        // Create a new holding
        await prisma.userHolding.create({
          data: {
            userId,
            securityId: security.id,
            quantity: input.quantity,
            avgBuyPrice: input.price,
          },
        });
      } else {
        // Update average buy price and quantity
        const newQuantity = existingHolding.quantity + input.quantity;
        const totalCost =
          existingHolding.avgBuyPrice! * existingHolding.quantity +
          input.price * input.quantity;
        const newAvgPrice = totalCost / newQuantity;
  
        await prisma.userHolding.update({
          where: {
            userId_securityId: {
              userId,
              securityId: security.id,
            },
          },
          data: {
            quantity: newQuantity,
            avgBuyPrice: newAvgPrice,
          },
        });
      }
    } else if (input.type === 'SELL') {
      if (!existingHolding || existingHolding.quantity < input.quantity) {
        throw new Error('Insufficient quantity to sell');
      }
  
      const newQuantity = existingHolding.quantity - input.quantity;
  
      await prisma.userHolding.update({
        where: {
          userId_securityId: {
            userId,
            securityId: security.id,
          },
        },
        data: {
          quantity: newQuantity,
          // avgBuyPrice remains unchanged
        },
      });
    }
  }



*/












/*
export async function addHolding(stockCode: string): Promise<void> {
    try {
      const userId = await getUserId();
  
      const exchange = "ASX";
      //const companyName = "Unknown Company";
  
      // Step 1: Check if the security exists
      let security = await prisma.security.findUnique({
        where: {
          stockCode_exchange: {
            stockCode,
            exchange,
          },
        },
      });
  
      // Step 2: If not, create it
      if (!security) {
        security = await prisma.security.create({
          data: {
            stockCode,
            exchange,
          },
        });
      }
  
      // Step 3: Add holding with default quantity 0
      await prisma.userHolding.create({
        data: {
          userId,
          securityId: security.id,
          quantity: 0,        // Optional since default is in schema
          avgBuyPrice: null,  // Optional (can omit this line)
        },
      });
  
    } catch (error) {
      if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('userId_securityId')
      ) {
        console.log("User already holds this stock.");
      } else {
        console.error("Error adding holding:", error);
        throw error;
      }
    }
  }



  export async function deleteHolding(stockCode: string) {
    try {
      const userId = await getUserId();
      const exchange = "ASX";
  
      // Step 1: Find the shared Security
      const security = await prisma.security.findUnique({
        where: {
          stockCode_exchange: {
            stockCode,
            exchange,
          },
        },
      });
  
      if (!security) {
        console.error("Security not found");
        return;
      }
  
      // Step 2: Delete all user transactions for this security
      await prisma.stockTransaction.deleteMany({
        where: {
          userId,
          securityId: security.id,
        },
      });
  
      // Step 3: Delete the UserHolding
      await prisma.userHolding.deleteMany({
        where: {
          userId,
          securityId: security.id,
        },
      });
  
      console.log("Holding and related transactions deleted:", stockCode);
      revalidatePath("/");
  
    } catch (error) {
      console.error("Error deleting holding:", error);
    }
  }
*/


