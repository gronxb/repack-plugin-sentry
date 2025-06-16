import {
	Compilation,
	type Compiler,
	type RspackPluginInstance,
} from "@rspack/core";
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

		compiler.hooks.thisCompilation.tap(
			"AddDebugIdAfterSourceMapPlugin",
			(compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: "AddDebugIdAfterSourceMapPlugin",
						stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
					},
					(assets) => {
						for (const assetName of Object.keys(assets)) {
							if (!assetName.endsWith(".map")) continue;

							const asset = compilation.getAsset(assetName);
							const source = asset?.source.source();

							if (!source) {
								continue;
							}
							try {
								const mapJson = JSON.parse(source.toString());
								mapJson.debug_id = debugId;
								mapJson.debugId = debugId;
								const updatedSource = JSON.stringify(mapJson);
								compilation.updateAsset(
									assetName,
									new compiler.webpack.sources.RawSource(updatedSource),
								);
								console.log(`[debug_id] added to: ${assetName}`);
							} catch (e) {
								console.warn(`[debug_id] Failed to parse ${assetName} as JSON`);
							}
						}
					},
				);
			},
		);
	}
}
