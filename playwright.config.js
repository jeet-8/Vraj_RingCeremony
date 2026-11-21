import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 35000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile-390x844',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
    {
      name: 'Mobile-320x568',
      use: {
        viewport: { width: 320, height: 568 },
        isMobile: true,
      },
    },
    {
      name: 'Mobile-360x640',
      use: {
        viewport: { width: 360, height: 640 },
        isMobile: true,
      },
    },
    {
      name: 'Mobile-412x915',
      use: {
        viewport: { width: 412, height: 915 },
        isMobile: true,
      },
    },
  ],
  webServer: {
    command: 'cmd.exe /c npx vite preview --port 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
