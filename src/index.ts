import * as fs from "fs";
import * as path from "path";
import type { Compilation, Compiler, RspackPluginInstance } from "@rspack/core";
import { v4 as uuidv4 } from "uuid";

interface AssetEmittedInfo {
	content: Buffer | string;
	sourceFilename?: string;
}

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

		compiler.hooks.assetEmitted.tap(
			"AddDebugIdAfterSourceMapPlugin",
			(file: string, info: AssetEmittedInfo) => {
				if (!file.endsWith(".map")) return;

				const source = info.content;
				if (!source) {
					return;
				}

				if (!compiler.options.output.path) {
					return;
				}

				try {
					const mapJson = JSON.parse(source.toString());
					mapJson.debug_id = debugId;
					mapJson.debugId = debugId;
					const updatedSource = JSON.stringify(mapJson);

					const outputPath = path.join(compiler.options.output.path, file);
					fs.writeFileSync(outputPath, updatedSource);
				} catch {
					throw new Error(`Failed to parse ${file} as JSON`);
				}
			},
		);
	}
}
