import { randomUUID } from "crypto";
import type { Compiler, RspackPluginInstance } from "@rspack/core";
import { RawSource } from "webpack-sources";

export class SentryDebugIdPlugin implements RspackPluginInstance {
	apply(compiler: Compiler) {
		const debugId = randomUUID();

		compiler.hooks.emit.tap("SentryDebugIdPlugin", (compilation) => {
			for (const filename of Object.keys(compilation.assets)) {
				if (filename.endsWith(".map")) {
					const sourceMap = JSON.parse(
						compilation.assets[filename].source().toString(),
					);
					sourceMap.debug_id = debugId;
					sourceMap.debugId = debugId;
					compilation.updateAsset(
						filename,
						new RawSource(JSON.stringify(sourceMap, null, 2)),
					);
				}
			}
		});

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
