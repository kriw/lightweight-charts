/// <reference types="node" />

import { PNG } from 'pngjs';
import {
	Browser,
	launch as launchPuppeteer,
	LaunchOptions,
	Response,
} from 'puppeteer';

const viewportWidth = 600;
const viewportHeight = 600;

export class Screenshoter {
	private _browserPromise: Promise<Browser>;

	public constructor(noSandbox: boolean, devicePixelRatio: number = 1) {
		const puppeteerOptions: LaunchOptions = {
			defaultViewport: {
				deviceScaleFactor: devicePixelRatio,
				width: viewportWidth,
				height: viewportHeight,
			},
		};

		if (noSandbox) {
			puppeteerOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
		}

		this._browserPromise = launchPuppeteer(puppeteerOptions);
	}

	public async close(): Promise<void> {
		const browser = await this._browserPromise;
		delete this._browserPromise;
		await browser.close();
	}

	public async generateScreenshot(pageContent: string): Promise<PNG> {
		let page;

		try {
			const browser = await this._browserPromise;
			page = await browser.newPage();

			const errors: string[] = [];
			page.on('pageerror', (error: Error) => {
				errors.push(error.message);
			});

			page.on('response', (response: Response) => {
				if (!response.ok()) {
					errors.push(`Network error: ${response.url()} status=${response.status()}`);
				}
			});

			await page.setContent(pageContent, { waitUntil: 'load' });

			// to avoid random cursor position
			await page.mouse.move(viewportWidth / 2, viewportHeight / 2);

			// wait for test case is ready
			await page.evaluate(() => {
				// tslint:disable-next-line:no-any
				return (window as any).testCaseReady;
			});

			// let's wait until the next af to make sure that everything is repainted
			await page.evaluate(() => {
				return new Promise((resolve: () => void) => {
					window.requestAnimationFrame(() => {
						// and a little more time after af :)
						setTimeout(resolve, 50);
					});
				});
			});

			if (errors.length !== 0) {
				throw new Error(errors.join('\n'));
			}

			return PNG.sync.read(await page.screenshot({ encoding: 'binary' }));
		} finally {
			if (page !== undefined) {
				await page.close();
			}
		}
	}
}
