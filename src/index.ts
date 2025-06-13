import { randomUUID } from "crypto";
import type { Compiler, RspackPluginInstance } from "@rspack/core";

export class SentryDebugIdPlugin implements RspackPluginInstance {
	apply(compiler: Compiler) {
		const debugId = randomUUID();

		new compiler.webpack.BannerPlugin({
			banner: `
var _sentryDebugIds, _sentryDebugIdIdentifier;

if (void 0 === _sentryDebugIds) {
	_sentryDebugIds = {};
}

try {
	var stack = (new Error).stack;
	if (stack) {
		_sentryDebugIds[stack] = "${debugId}";
		_sentryDebugIdIdentifier = "sentry-dbid-${debugId}";
	}
} catch (e) {}
`,
			raw: true,
		}).apply(compiler);

		new compiler.webpack.BannerPlugin({
			banner: `//# debugId=${debugId}\n`,
			raw: true,
			footer: true,
		}).apply(compiler);
	}
}
