const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const [text, queryString] = req.url.split('?');

    const params = new URLSearchParams(queryString);
    const toCase = params.get('toCase');

    const initialText = text.slice(1);

    // const errors = [];

    if (!initialText && !toCase) {
      res.statusCode = 400;

      res.end(
        JSON.stringify({
          errors: [
            {
              message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
            },
            {
              message: `"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
            },
          ],
        }),
      );

      return;
    }

    if (!initialText) {
      res.statusCode = 400;

      res.end(
        JSON.stringify({
          errors: [
            {
              message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
            },
          ],
        }),
      );

      return;
    }

    if (!toCase) {
      res.statusCode = 400;

      res.end(
        JSON.stringify({
          errors: [
            {
              message: `"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
            },
          ],
        }),
      );

      return;
    }

    try {
      const { originalCase, convertedText } = convertToCase(
        initialText,
        toCase,
      );

      res.statusCode = 200;

      res.end(
        JSON.stringify({
          originalCase: originalCase,
          targetCase: toCase,
          originalText: initialText,
          convertedText: convertedText,
        }),
      );
    } catch {
      res.statusCode = 400;

      const errors = [
        {
          message: `This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.`,
        },
      ];

      if (!initialText) {
        errors.unshift({
          message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
        });
      }

      res.end(
        JSON.stringify({
          errors,
        }),
      );
    }
  });

  return server;
}

module.exports = {
  createServer,
};
