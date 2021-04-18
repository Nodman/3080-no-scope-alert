const logger = require("../logger");

const storeUrl =
  "https://www.amazon.com/stores/page/6B204EA4-AAAC-4776-82B1-D7C3BD9DDC82";
const dataRe = /"products":\[(.*)\],"allProd/m;
const headers = {
  authority: "www.amazon.com",
  pragma: "no-cache",
  "cache-control": "no-cache",
  dnt: "1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "sec-fetch-site": "none",
  "sec-fetch-mode": "navigate",
  "sec-fetch-dest": "document",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
};

function parser(body) {
  try {
    const [, match] = body.match(dataRe) || [];
    const products = JSON.parse(`[${match}]`);

    const avaliableProducts = products.filter((product) =>
      product.buyingOptions.some(
        (option) => {
          const stockType = option.availability.type;
          const inStock = stockType !== "OUT_OF_STOCK"
          logger.log(stockType)

          return inStock
        }
      )
    );

    if (!avaliableProducts.length) {
      return [];
    }

    // TODO remove this after defining where price is
    return avaliableProducts.map(
      (product) =>
        logger.log(product.buyingOptions) || {
          product: {
            name: product.title.displayString,
            price: "unknown",
          },
          store: {
            name: "Amazon",
            link: product.links.viewOnAmazon.url,
          },
        }
    );
  } catch (error) {
    logger.log(`Body parse error: ${error}`, "error", "Amazon");
  }
}

module.exports = {
  parser,
  storeUrl,
  headers,
};