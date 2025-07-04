import { useEffect, useRef } from "react";
import { Checkout } from "./checkout";

function App() {
  const checkout = useRef<Checkout>(null);
  const setup = () => {
    if (!checkout.current) {
      throw new Error("Checkout is not ready");
    }
    checkout.current.setPrice("soup", 1.89);
  };
  const scan = (item: string) => {
    if (!checkout.current) {
      throw new Error("Checkout is not ready");
    }
    checkout.current.scan(item);
  };

  useEffect(() => {
    if (checkout.current) {
      setup();
    }
  }, [checkout]);
  return (
    <div>
      <button onClick={() => scan("soup")}>Scan Soup</button>
      <Checkout ref={checkout} />
    </div>
  );
}

export default App;
