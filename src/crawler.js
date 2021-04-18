const fetch = require("node-fetch");

const logger = require("./logger");

/**
 * product: {
 * price: string
 * name: string,
 * }
 * store: {
 * name: string,
 * link: string,
 * }
 **/

function resultsToString(results) {
  return (
    "\n!!!ALERT!!!\n" +
    results.map(({ product, store }) => {
      return `${product.name} - ${product.price}\n${store.link}`;
    })
  );
}

async function crawl({ storeUrl, headers, parser }) {
  logger.log(`crawling on ${storeUrl}`, 'warn', '<-');

  try {
    const response = await fetch(storeUrl, {
      method: 'get',
      headers: headers || {},
    });

    logger.log(`response status: ${response.status}`, 'warn', '->')

    const body = await response.text();

    const results = parser(body);

    if (results.length) {
      const message = resultsToString(results);
      logger.message(message);

      return { message, status: response.status };
    }

    return { message: null, status: response.status };
  } catch(error) {
    logger.log(`Crawler error: ${error}`, 'error')
  }
}

module.exports = {
  crawl,
};
