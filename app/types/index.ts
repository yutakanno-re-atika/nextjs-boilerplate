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
  // ★ここを修正：エラーが出ないよう string に緩和します
  type: string; 
  form: string;
  description: string;
  price_offset: number;
  ratio: number;
}

export interface ReservationData {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  items: string;
  total: number;
}

export interface MarketData {
  status: string;
  config: { market_price: number };
  history: { date: string; value: number }[];
  wires: ProductWire[];
  castings: ProductCasting[];
  reservations?: ReservationData[];
  stats: { monthlyTotal: number };
}

export interface UserData {
  id: string;
  name: string;
  rank: 'COPPER' | 'SILVER' | 'GOLD';
  role: 'ADMIN' | 'MEMBER';
  companyName?: string;
}
