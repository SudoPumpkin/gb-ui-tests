import { test, expect } from '@playwright/test';
// This test checks if the public assets (JS, CSS, HTML) of the application load correctly.
// It verifies that the JS bundle, CSS bundle, and HTML page return a 200 status code and have the correct content type.

test.describe('[api] [assets] [smoke] Public asset and page load verification', () => {
  test('JS bundle loads', async ({ request }) => {
    const response = await request.get('https://gb-saa-test.vercel.app/js/main.js');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/javascript');
  });

  test('CSS bundle loads', async ({ request }) => {
    const response = await request.get('https://gb-saa-test.vercel.app/css/styles.css');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/css');
  });

  test('HTML page loads', async ({ request }) => {
    const response = await request.get('https://gb-saa-test.vercel.app/');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });
});
