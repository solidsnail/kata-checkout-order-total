import { useEffect, useRef } from "react";
import { Checkout } from "./checkout";
import { Product } from "./product";
import { API_RESPONSE } from "./api";

function App() {
  const checkout = useRef<Checkout>(null);
  const setup = () => {
    if (!checkout.current) {
      throw new Error("Checkout is not ready");
    }
    for (const product of Object.values(API_RESPONSE)) {
      checkout.current.setPrice(product.id, product.price, product.byWeight);
      if (product.markdown) {
        checkout.current.setMarkdown(product.id, product.markdown);
      }
      if (product.special) {
        checkout.current.setSpecial(product.id, product.special);
      }
    }
  };
  const scan = (item: string, weight?: number) => {
    if (!checkout.current) {
      throw new Error("Checkout is not ready");
    }
    checkout.current.scan(item, weight);
  };
  const remove = (item: string, weight?: number) => {
    if (!checkout.current) {
      throw new Error("Checkout is not ready");
    }
    checkout.current.remove(item, weight);
  };
  useEffect(() => {
    if (checkout.current) {
      setup();
    }
  }, [checkout]);
  return (
    <div className="app">
      <div className="products">
        {Object.values(API_RESPONSE).map((product) => (
          <Product {...product} onScan={scan} onRemove={remove} />
        ))}
      </div>

      <Checkout ref={checkout} />
    </div>
  );
}

export default App;
