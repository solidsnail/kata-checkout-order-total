import { defineFeature, loadFeature } from "jest-cucumber";
import { act, render } from "@testing-library/react";
import { Checkout } from "./checkout";

let checkout: Checkout;
const CheckoutWrapper = () => (
  <Checkout
    ref={(ref) => {
      if (ref) {
        checkout = ref;
      }
    }}
  />
);

const feature = loadFeature(`${__dirname}/gherkin.txt`);

defineFeature(feature, (test) => {
  beforeEach(() => {
    render(<CheckoutWrapper />);
  });

  test("USE-CASE 1: Scanning a per-unit item adds its price to the total", ({
    given,
    when,
    then,
  }) => {
    given(/^a checkout with soup priced at \$(\d+\.\d{2})$/, (price) => {
      act(() => {
        checkout.setPrice("soup", parseFloat(price));
      });
    });

    when('I scan "soup"', () => {
      act(() => {
        checkout.scan("soup");
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });
});
