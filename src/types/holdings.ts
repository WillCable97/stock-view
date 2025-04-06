export type Holding = {
  stockCode: string;
  quantity: number;
  avgBuyPrice: number;
  price: number;
}

export type Transaction = {
  id: number;
  date: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
} 