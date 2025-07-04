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
    given(
      /^a checkout with "(.*)" priced at \$(\d+\.\d{2})$/,
      (name, price) => {
        act(() => {
          checkout.setPrice(name, parseFloat(price));
        });
      }
    );

    when(/^I scan "(.*)"$/, (name) => {
      act(() => {
        checkout.scan(name);
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 2: Weihted item total calculation", ({
    given,
    when,
    then,
  }) => {
    given(
      /^a checkout with "(.*)" priced at \$(\d+\.\d{2}) per pound$/,
      (name, price) => {
        act(() => {
          checkout.setPrice(name, parseFloat(price), true);
        });
      }
    );

    when(/^I scan (\d+) pounds "(.*)"$/, (weight, name) => {
      act(() => {
        checkout.scan(name, weight);
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });
});
