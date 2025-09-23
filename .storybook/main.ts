import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-a11y"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "typescript": {
    "check": false,
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      "shouldExtractLiteralValuesFromEnum": true,
      "propFilter": (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://erdseuduiclcatzntljc.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZHNldWR1aWNsY2F0em50bGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzg0MTgsImV4cCI6MjA3MzkxNDQxOH0.KSPHAkw87ntX81lp3VCMNe-VxV40UwRshQNWoI8MkDk"
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/contexts/admin-context': require.resolve('./mocks/admin-context.tsx'),
        '@/contexts/language-context': require.resolve('./mocks/language-context.tsx'),
      }
    }
    return config
  },
};
export default config;