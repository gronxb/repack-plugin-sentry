# repack-plugin-sentry

[![npm version](https://img.shields.io/npm/v/repack-plugin-sentry.svg)](https://www.npmjs.com/package/repack-plugin-sentry)
[![license](https://img.shields.io/npm/l/repack-plugin-sentry.svg)](https://github.com/gronxb/repack-plugin-sentry/blob/main/LICENSE)

A Repack plugin that automatically injects Sentry debug IDs into JavaScript bundles, enabling better source map tracking and error monitoring in your React Native applications.

## Features

- 🔍 **Automatic Debug ID Generation**: Generates unique debug IDs for each bundle
- 🗺️ **Source Map Integration**: Connects source maps with bundles for better error tracking
- ⚡ **Zero Configuration**: Works out of the box with sensible defaults
- 🔧 **Re.Pack Compatible**: Seamlessly integrates with Re.Pack build system

## Installation

```bash
npm install --save-dev repack-plugin-sentry
```

```bash
yarn add --dev repack-plugin-sentry
```

```bash
pnpm add --save-dev repack-plugin-sentry
```

## Usage

### Basic Usage

Add the plugin to your `webpack.config.js` or Repack configuration:

```typescript
import { SentryDebugIdPlugin } from "repack-plugin-sentry";

export default {
  plugins: [
    new SentryDebugIdPlugin(),
    // ... other plugins
  ],
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [gronxb](https://github.com/gronxb)
