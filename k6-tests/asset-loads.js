import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10, // Virtual users
  duration: '5s', // Test duration
};

export default function () {
  // Test 1: JS bundle
  const jsRes = http.get('https://gb-saa-test.vercel.app/js/main.js');
  check(jsRes, {
    'JS status is 200': (res) => res.status === 200,
    'JS content-type is JavaScript': (res) =>
      res.headers['Content-Type'].includes('application/javascript'),
  });

  // Test 2: CSS bundle
  const cssRes = http.get('https://gb-saa-test.vercel.app/css/styles.css');
  check(cssRes, {
    'CSS status is 200': (res) => res.status === 200,
    'CSS content-type is CSS': (res) => res.headers['Content-Type'].includes('text/css'),
  });

  // Test 3: HTML page
  const htmlRes = http.get('https://gb-saa-test.vercel.app/');
  check(htmlRes, {
    'HTML status is 200': (res) => res.status === 200,
    'HTML content-type is HTML': (res) => res.headers['Content-Type'].includes('text/html'),
  });
}
