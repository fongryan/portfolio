import assert from "node:assert/strict";
import test from "node:test";
import {
  productAtlas,
  productAtlasCategories,
} from "../src/lib/product-atlas.ts";

test("product atlas is ranked by money, scale, and Hermes fit", () => {
  assert.equal(productAtlas.length, 120);
  assert.equal(new Set(productAtlas.map((product) => product.slug)).size, 120);
  assert.equal(productAtlasCategories.length, 12);

  for (const [index, product] of productAtlas.entries()) {
    assert.equal(product.rank, index + 1);
    assert.ok(product.moneyScore >= 1 && product.moneyScore <= 10);
    assert.ok(product.scaleScore >= 1 && product.scaleScore <= 10);
    assert.ok(product.hermesScore >= 1 && product.hermesScore <= 10);
    assert.equal(
      product.priorityScore,
      product.moneyScore * 4 + product.scaleScore * 3 + product.hermesScore * 3,
    );
    assert.match(
      product.revenueModel,
      /subscription|pilot|usage|retainer|implementation|resolution/i,
    );
    if (index > 0) {
      assert.ok(
        productAtlas[index - 1].priorityScore >= product.priorityScore,
        `${product.name} must not outrank a higher-scoring product`,
      );
    }
  }

  assert.equal(productAtlas[0].category, "Revenue and sales");
  assert.match(
    productAtlas
      .slice(0, 20)
      .map((product) => product.name)
      .join(" "),
    /Appointment setter|Support inbox agent|Inbound lead responder/,
  );
});
