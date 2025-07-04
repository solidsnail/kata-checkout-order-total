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

  test("USE-CASE 3: Markdown reduces item price", ({
    given,
    and,
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

    and(/^a markdown of \$(\d+\.\d{2}) on "(.*)"$/, (markdown, name) => {
      act(() => {
        checkout.setMarkdown(name, parseFloat(markdown));
      });
    });

    when(/^I scan "(.*)"$/, (name) => {
      act(() => {
        checkout.scan(name);
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 4: Buy N get M at % off", ({ given, and, when, then }) => {
    given(
      /^a checkout with "(.*)" priced at \$(\d+\.\d{2})$/,
      (name, price) => {
        act(() => {
          checkout.setPrice(name, parseFloat(price));
        });
      }
    );

    and(/^a special "buy (\d+) get (\d+) free" on "soup"$/, (buy, get) => {
      act(() => {
        checkout.setSpecial("soup", {
          type: "BUY_N_GET_M_PERCENT_OFF",
          buy: parseInt(buy),
          get: parseInt(get),
          percentOff: 100,
        });
      });
    });

    when(/^I scan "soup" (\d+) times$/, (count) => {
      act(() => {
        for (let i = 0; i < parseInt(count); i++) {
          checkout.scan("soup");
        }
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 5: N for X special", ({ given, and, when, then }) => {
    given(/^a checkout with soup priced at \$(\d+\.\d{2})$/, (price) => {
      act(() => {
        checkout.setPrice("soup", parseFloat(price));
      });
    });

    and('a special "3 for $5.00" on "soup"', () => {
      act(() => {
        checkout.setSpecial("soup", {
          type: "N_FOR_X",
          count: 3,
          price: 5.0,
        });
      });
    });

    when(/^I scan "soup" (\d+) times$/, (count) => {
      act(() => {
        for (let i = 0; i < parseInt(count); i++) {
          checkout.scan("soup");
        }
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 6: Buy N get M at % off (limit applied)", ({
    given,
    and,
    when,
    then,
  }) => {
    given(/^a checkout with soup priced at \$(\d+\.\d{2})$/, (price) => {
      act(() => {
        checkout.setPrice("soup", parseFloat(price));
      });
    });

    and(/^a markdown of \$(\d+\.\d{2}) on "soup"$/, (markdown) => {
      act(() => {
        checkout.setMarkdown("soup", parseFloat(markdown));
      });
    });

    and(
      /^a special "buy (\d+) get (\d+) free" with limit (\d+) on "soup"$/,
      (buy, get, limit) => {
        act(() => {
          checkout.setSpecial("soup", {
            type: "BUY_N_GET_M_PERCENT_OFF",
            buy: parseInt(buy),
            get: parseInt(get),
            percentOff: 100,
            limit: parseInt(limit),
          });
        });
      }
    );

    when(/^I scan "soup" (\d+) times$/, (count) => {
      act(() => {
        for (let i = 0; i < parseInt(count); i++) {
          checkout.scan("soup");
        }
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 7: Removing an item", ({ given, when, then, and }) => {
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

    and('I remove "soup"', () => {
      act(() => {
        checkout.remove("soup");
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });

  test("USE-CASE 8: Weighted special - Buy 2lb get 1lb half off", ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^a checkout with beef priced at \$(\d+\.\d{2}) per pound$/,
      (price) => {
        act(() => {
          checkout.setPrice("beef", parseFloat(price), true);
        });
      }
    );

    and('a special "buy 2lb get 1lb 50% off" on "beef"', () => {
      act(() => {
        checkout.setSpecial("beef", {
          type: "BUY_WEIGHT_GET_WEIGHT_PERCENT_OFF",
          buyWeight: 2,
          getWeight: 1,
          percentOff: 50,
        });
      });
    });

    when('I scan 3 pounds of "beef"', () => {
      act(() => {
        checkout.scan("beef", 3);
      });
    });

    then(/^the total should be \$(\d+\.\d{2})$/, (expected) => {
      expect(checkout.state.total).toBeCloseTo(parseFloat(expected));
    });
  });
});
