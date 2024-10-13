const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');
const { detectCase } = require('./convertToCase/detectCase');

function createServer() {
  const server = http.createServer((req, res) => {
    const [text, queryString] = req.url.split('?');

    const params = new URLSearchParams(queryString);
    const toCase = params.get('toCase');

    if (text === '/' || !toCase) {
      res.statusCode = 400;

      res.end(
        JSON.stringify({
          statusText: 'NOT OK',
          payload: {
            errors: [
              {
                message:
                  'Text in the URL and query param `toCase` are mandatory.',
              },
            ],
          },
        }),
      );

      return;
    }

    const initialText = text.slice(1);
    const result = convertToCase(initialText, toCase).convertedText;
    const originalCase = detectCase(initialText);

    res.setHeader('Content-Type', 'application/json');

    res.statusCode = 200;

    res.end(
      JSON.stringify({
        originalCase: originalCase,
        targetCase: toCase,
        originalText: initialText,
        convertedText: result,
      }),
    );
  });

  return server;
}

module.exports = {
  createServer,
};
