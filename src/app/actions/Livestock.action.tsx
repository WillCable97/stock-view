/*
import { getHoldings } from "./userHoldings.action";

//For main user stock view, will ingest list of user stocks and add price and price change
export async function getStockDetailsForView(){
    const allUserHoldings = await getHoldings();
    console.log("All user holdings:", allUserHoldings);
    const allUserHoldingsNames = allUserHoldings.map((holding) => holding.stockCode);
    const enrichedHoldings = await addStockPriceData(allUserHoldingsNames);

    return enrichedHoldings;
    
}
*/
export async function getStockPriceData(stockCodes: Array<string>){
    const concatHoldings = stockCodes.join(",");

    console.log("Holdings:", concatHoldings);

    try{
        //Calling API from server side component will sometimes requre sa full file path
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/stock/current?symbols=${concatHoldings}`);

        const data = await res.json();

        const finalObject = stockCodes.map((holding) => ({
            stockCode: holding, 
            price: data[holding]['current_price'], 
            change: data[holding]['daily_change'],
         }))

        return finalObject;
    }catch(err){
        console.error("Error fetching stock prices:", err);
        throw err;
    }
}
