/* eslint-disable no-console */
const axios = require('axios');

const BASE = 'http://localhost:5700';

const href = BASE + '/hello-world' + '?toCase=SNAKE';

console.log(href);

axios.get(href).catch((err) => console.log(err));
