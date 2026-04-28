import { tanstackConfig } from '@tanstack/eslint-config'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: [
      '.prettierrc.*',
      'eslint.config.*',
      '.nitro/**',
      '.pixi/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.vite/**',
      'coverage/**',
      'packages/*/vitest.config.ts', // Config files outside tsconfig rootDir
    ],
  },
  ...tanstackConfig,
  {
    // Custom rules to prevent server modules from being imported in client code
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/server/*',
                '!**/*.server',
                '!**/*.server.ts',
              ],
              message:
                'Server-only modules cannot be imported in client code. Only .server files (Server Functions) are allowed.',
            },
            {
              group: [
                '@google-cloud/*',
              ],
              message: 'Google Cloud libraries cannot be used in client code',
            },
            {
              group: [
                'node:*',
              ],
              message: 'Node.js built-in modules cannot be used in client code',
            },
          ],
        },
      ],
    },
  },
  {
    // Stricter rules for components (not routes - routes can call server functions)
    files: [
      '**/src/components/**/*',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@aegis/job-runner',
                '@aegis/job-runner/**',
              ],
              message:
                'Components cannot import from @aegis/job-runner. Use Server Functions instead.',
            },
            {
              group: [
                '**/lib/clients/*.server',
                '**/lib/clients/gcs.server',
              ],
              message:
                'Components cannot import server directories or server-only clients',
            },
            {
              group: [
                '@google-cloud/*',
                '@aws-sdk/*',
              ],
              message: 'Cloud provider SDKs cannot be imported in components',
            },
            {
              group: [
                'fs',
                'path',
                'crypto',
                'stream',
                'buffer',
                'node:*',
              ],
              message: 'Node.js modules cannot be imported in components',
            },
          ],
        },
      ],
    },
  },
  {
    // Allow everything in server routes and server modules
    files: [
      '**/src/routes/api/**/*',
      '**/src/lib/server/**/*',
      '**/src/lib/clients/*.server.ts',
      '**/*.server.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // Allow server function imports in hooks, API barrel files, routes, and types
    // TanStack Start server functions are callable from client via RPC
    files: [
      '**/src/hooks/**/*',
      '**/src/lib/api/**/*',
      '**/src/types/**/*',
      '**/src/routes/**/*',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // Allow Node.js imports in config files
    files: [
      '*.config.ts',
      '*.config.js',
      '**/vite.config.*',
      '**/vitest.config.*',
      'eslint.config.*',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // Allow Node.js imports in test files
    files: [
      '**/src/test/**/*',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    // Allow Node.js imports in server-side CLI tools and core packages
    files: [
      'packages/**/*',
    ],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  },

  // Strict array type rules
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/array-type': [
        'warn',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
    },
  },

  // Prevent technical debt regression
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // Prevent new `any` usage - aligns with architecture principle
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: false,
          fixToUnknown: true,
        },
      ],

      // Prevent console.log in server code - enforce structured logging
      'no-console': [
        'warn',
        {
          allow: [
            'warn',
            'error',
          ], // Allow console.warn/error as fallback
        },
      ],

      // Enforce consistent function return types
      '@typescript-eslint/explicit-function-return-type': [
        'off', // Keep off for now, too strict for existing code
      ],

      // Prevent unused variables
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Warn when event logger methods (.info, .success, .error, .warn) are called
      // without trackingJobId in job-context files. This helps ensure proper
      // job tracking and event correlation in the job queue system.
      // See: docs/coding-agents/EVENT-LOGGER-GUIDELINES.md
      'no-restricted-syntax': [
        'warn',
        {
          // Match: logger.info({...}) where metadata object doesn't have trackingJobId
          selector:
            'CallExpression[callee.property.name=/^(info|success|error|warn)$/] > ObjectExpression:not(:has(Property[key.name="trackingJobId"]))',
          message:
            'Event logger methods should include trackingJobId in metadata when called in job context. If no job context exists, add a comment: // eslint-disable-next-line no-restricted-syntax -- No job context',
        },
      ],
    },
  },

  // Stricter console rules for server files
  {
    files: [
      'src/lib/server/**/*.ts',
      '**/*.server.ts',
    ],
    rules: {
      // Prevent all console usage in server files
      // Use logger.info/error/warn instead for structured logging
      'no-console': 'error',
    },
  },

  // Allow console in specific files that need it
  {
    files: [
      'src/lib/config/env.server.ts', // Bootstrap fail-fast error reporting
      'src/lib/server/console-override.ts', // Console wrapper implementation
      'src/i18n/validate.ts', // CLI script
      'src/lib/utils/markdown.ts', // Isomorphic utility (client + server)
      'scripts/**/*', // Build and development scripts
      'tests/**/*', // Test files
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/cli/**/*', // CLI tools use console for user output
      '**/bin/**/*', // Binary entry points
      '**/examples/**/*', // Example scripts demonstrating usage
      '**/tests/manual/**/*', // Manual test scripts
      '**/tests/run-*.ts', // Test runner scripts
    ],
    rules: {
      'no-console': 'off',
    },
  },

  // CLI tools: disable job-context rules (no trackingJobId needed)
  {
    files: [
      '**/cli/**/*',
    ],
    rules: {
      'no-restricted-syntax': 'off', // CLI commands don't run in job context
    },
  },

  // Relax `any` rules for test files and labs (less critical for type safety)
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      'packages/**/*',
      'scripts/**/*',
      'src/test/**/*',
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning for tests
    },
  },
]
