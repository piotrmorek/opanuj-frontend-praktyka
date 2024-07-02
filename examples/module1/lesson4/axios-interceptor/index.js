import axios from 'axios';

const fetchProxy = new Proxy(fetch, {
  apply(target, thisArg, args) {
    const time = new Date().getTime();
    const [url, options] = args;
    return target(url, {
      ...options
    }).finally(() => {
      console.log(`Request took ${(new Date().getTime() - time)}ms`);
    })
  }
})

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers['x-request-time'] = new Date().getTime();
  return config;
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  const requestTime = response.config.headers['x-request-time'];
  console.log(`Request took ${new Date().getTime() - new Date(Number(requestTime)).getTime()}ms`);
  return response;
});

// const {
//   data: { articles },
// } = await axios('/api/data/articles?timeout=3000');

const response = await fetchProxy('/api/data/articles?timeout=3000');
const { articles } = await response.json();

document.querySelector('#data').innerHTML = articles[0].content;
