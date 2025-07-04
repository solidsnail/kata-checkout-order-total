import { Component } from "react";
import type { TItem, TSpecial } from "./types";

type Props = {
  setup?: [];
};

type State = {
  prices: Map<string, { price: number; byWeight: boolean }>;
  markdowns: Map<string, number>;
  specials: Map<string, TSpecial[]>;
  scanned: TItem[];
  total: number;
};

export class Checkout extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prices: new Map(),
      markdowns: new Map(),
      specials: new Map(),
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

  setSpecial = (name: string, special: TSpecial) => {
    this.setState((prevState) => {
      const specials = new Map(prevState.specials);
      if (!specials.has(name)) specials.set(name, []);
      specials.get(name)!.push(special);
      return { specials };
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
    const { scanned, prices, markdowns, specials: allSpecials } = this.state;
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
      const specials = allSpecials.get(name) ?? [];
      if (byWeight) {
        total += this.calculateWeightTotal(items, price, markdown, specials);
      } else {
        total += this.calculateUnitTotal(items, price, markdown, specials);
      }
    }
    this.setState({ total: parseFloat(total.toFixed(2)) });
  };

  calculateWeightTotal(
    items: TItem[],
    price: number,
    markdown: number,
    specials: TSpecial[]
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
    markdown: number,
    specials: TSpecial[]
  ): number => {
    let count = items.length;
    let total = 0;

    const nForX = specials.find((r) => r.type === "N_FOR_X");
    if (nForX) {
      while (count >= nForX.count) {
        total += nForX.price;
        count -= nForX.count;
      }
    }

    const buyNgetMOff = specials.find(
      (r) => r.type === "BUY_N_GET_M_PERCENT_OFF"
    );
    if (buyNgetMOff) {
      let remaining = count;
      let applied = 0;
      while (
        remaining >= buyNgetMOff.buy + buyNgetMOff.get &&
        (!buyNgetMOff.limit || applied < buyNgetMOff.limit)
      ) {
        total += buyNgetMOff.buy * (price - markdown);
        const discounted = Math.min(
          buyNgetMOff.get,
          buyNgetMOff.limit ? buyNgetMOff.limit - applied : buyNgetMOff.get
        );
        total +=
          discounted * (price - markdown) * (1 - buyNgetMOff.percentOff / 100);
        remaining -= buyNgetMOff.buy + buyNgetMOff.get;
        applied += discounted;
      }
      count = remaining;
    }
    total += count * (price - markdown);
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
