import { useState, type FC } from "react";
import { API_RESPONSE } from "./api";

type Props = (typeof API_RESPONSE)[keyof typeof API_RESPONSE] & {
  onScan: (item: string, weight?: number) => void;
  onRemove: (item: string, weight?: number) => void;
};
export const Product: FC<Props> = ({ src, id, weight, onScan, onRemove }) => {
  const [currentWeight, setCurrentWeight] = useState(weight);
  return (
    <div className="product">
      <img className="product-image" src={src} width={60} />
      <b className="product-name">{id}</b>
      <button className="product-add" onClick={() => onScan(id, currentWeight)}>
        add
      </button>
      <button
        className="product-remove"
        onClick={() => onRemove(id, currentWeight)}
      >
        remove
      </button>
      {typeof weight !== "undefined" && (
        <label className="product-weight">
          <span className="product-weight-label">Weight:</span>
          <input
            className="product-weight-input"
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value) as 1)}
          />
          <b className="product-weight-unit">pounds</b>
        </label>
      )}
    </div>
  );
};
