"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserId } from "./user.action";

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
        },
      });
  
      // Flatten the nested result to just stockCode
      return holdings.map(h => ({ stockCode: h.security.stockCode, quantity: h.quantity, avgBuyPrice: h.avgBuyPrice ?? 0 }));
  
    } catch (error) {
      console.error("Error fetching holdings:", error);
      return [];
    }
  }
















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


