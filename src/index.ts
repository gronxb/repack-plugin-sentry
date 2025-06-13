import { randomUUID } from "crypto";
import type { Compiler, RspackPluginInstance } from "@rspack/core";

export class HotUpdaterPlugin implements RspackPluginInstance {
	apply(compiler: Compiler) {
		new compiler.webpack.BannerPlugin({
			banner: `
var _sentryDebugIds, _sentryDebugIdIdentifier;

if (void 0 === _sentryDebugIds) {
	_sentryDebugIds = {};
}

try {
	var stack = (new Error).stack;
	if (stack) {
		_sentryDebugIds[stack] = "${randomUUID()}";
		_sentryDebugIdIdentifier = "sentry-dbid-${randomUUID()}";
	}
} catch (e) {}
`,
			raw: true,
		}).apply(compiler);

		new compiler.webpack.BannerPlugin({
			banner: "//# debugId=${debugId}",
			raw: true,
			footer: true,
		}).apply(compiler);
	}
}
