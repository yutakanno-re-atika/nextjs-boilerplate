export interface ProductWire {
  id: string;
  maker: string;
  name: string;
  sq: string;
  core: string;
  ratio: number;
  category: string;
}

export interface ProductCasting {
  id: string;
  name: string;
  type: 'Brass' | 'Bronze' | 'Alu';
  form: 'Solid' | 'Turnings';
  description: string;
  price_offset: number;
}

export interface MarketData {
  status: string;
  config: { market_price: number };
  history: { date: string; value: number }[];
  wires: ProductWire[];        // 変数名を明確化
  castings: ProductCasting[];  // 新規追加
  stats: { monthlyTotal: number };
}

export interface UserData {
  id: string;
  name: string;
  rank: 'COPPER' | 'SILVER' | 'GOLD';
  role: 'ADMIN' | 'MEMBER';
  companyName?: string;
}
