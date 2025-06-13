import type { Compiler, RspackPluginInstance } from "@rspack/core";
import { v4 as uuidv4 } from "uuid";

const createDebugIdBanner = (debugId: string) => `
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
`;

const createDebugIdFooter = (debugId: string) => `//# debugId=${debugId}\n`;

export class SentryDebugIdPlugin implements RspackPluginInstance {
	apply(compiler: Compiler) {
		const debugId = uuidv4();

		new compiler.webpack.BannerPlugin({
			banner: createDebugIdBanner(debugId),
			raw: true,
		}).apply(compiler);

		new compiler.webpack.BannerPlugin({
			banner: createDebugIdFooter(debugId),
			raw: true,
			footer: true,
		}).apply(compiler);
	}
}
