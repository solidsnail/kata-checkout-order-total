import { Component } from "react";
import type { TItem } from "./types";

type Props = {
  setup?: [];
};

type State = {
  prices: Map<string, { price: number; byWeight: boolean }>;
  scanned: TItem[];
  total: number;
};

export class Checkout extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prices: new Map(),
      scanned: [],
      total: 0,
    };
  }

  setPrice = (name: string, price: number, byWeight = false) => {
    this.setState((prevState) => {
      const prices = new Map(prevState.prices);
      prices.set(name, { price, byWeight });
      return { prices };
    });
  };

  scan = (name: string, weight?: number) => {
    const item = this.state.prices.get(name);
    if (!item) throw new Error(`No price set for ${name}`);
    const price = item.price;
    this.setState(
      (prevState) => ({
        scanned: [...prevState.scanned, { name, price, weight }],
      }),
      this.calcTotal
    );
  };

  calcTotal = () => {
    const { scanned, prices } = this.state;
    let total = 0;
    const grouped: Record<string, TItem[]> = {};
    scanned.forEach((item) => {
      if (!grouped[item.name]) grouped[item.name] = [];
      grouped[item.name].push(item);
    });
    for (const [name, items] of Object.entries(grouped)) {
      const priceInfo = prices.get(name);
      if (!priceInfo) continue;
      const { price, byWeight } = priceInfo;
      if (byWeight) {
        total += this.calculateWeightTotal(items, price);
      } else {
        total += this.calculateUnitTotal(items, price);
      }
    }
    this.setState({ total: parseFloat(total.toFixed(2)) });
  };

  calculateWeightTotal(items: TItem[], price: number) {
    throw new Error("Method not implemented.");
  }

  calculateUnitTotal = (items: TItem[], price: number): number => {
    const count = items.length;
    const total = count * price;
    return total;
  };

  render() {
    const { scanned, total } = this.state;
    const last = scanned[scanned.length - 1];

    return (
      <div>
        <code className="cash-register-screen">
          {last && (
            <div className="cash-register-screen-scanned">
              <span>{last.name}</span>
              <span>${last.price}</span>
            </div>
          )}
          <span className="cash-register-screen-total">Total: ${total}</span>
        </code>
      </div>
    );
  }
}
