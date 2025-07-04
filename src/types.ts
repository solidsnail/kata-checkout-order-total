export type TItem = {
  name: string;
  weight?: number;
  price: number;
};
export type TSpecial_BUYNGETMOFF = {
  type: "BUY_N_GET_M_PERCENT_OFF";
  buy: number;
  get: number;
  percentOff: number;
  limit?: number;
};
export type TSpecial_NFORX = {
  type: "N_FOR_X";
  price: number;
  count: number;
};
export type TSpecial = TSpecial_NFORX | TSpecial_BUYNGETMOFF;
