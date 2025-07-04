import { Component } from "react";
import type { TItem } from "./types";

type Props = {
  setup?: [];
};

type State = {
  prices: Map<string, { price: number; byWeight: boolean }>;
  markdowns: Map<string, number>;
  scanned: TItem[];
  total: number;
};

export class Checkout extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prices: new Map(),
      markdowns: new Map(),
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

  setMarkdown = (name: string, amount: number) => {
    this.setState((prevState) => {
      const markdowns = new Map(prevState.markdowns);
      markdowns.set(name, amount);
      return { markdowns };
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
    const { scanned, prices, markdowns } = this.state;
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
      const markdown = markdowns.get(name) ?? 0;
      if (byWeight) {
        total += this.calculateWeightTotal(items, price, markdown);
      } else {
        total += this.calculateUnitTotal(items, price, markdown);
      }
    }
    this.setState({ total: parseFloat(total.toFixed(2)) });
  };

  calculateWeightTotal(
    items: TItem[],
    price: number,
    markdown: number
  ): number {
    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight ?? 0),
      0
    );
    const total = totalWeight * (price - markdown);
    return total;
  }

  calculateUnitTotal = (
    items: TItem[],
    price: number,
    markdown: number
  ): number => {
    const count = items.length;
    const total = count * (price - markdown);
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
