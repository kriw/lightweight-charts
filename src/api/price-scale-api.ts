import { IDestroyable } from '../helpers/idestroyable';
import { DeepPartial } from '../helpers/strict-type-checks';

import { BarPrice } from '../model/bar';
import { ChartModel } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';
import { PriceScale, PriceScaleOptions } from '../model/price-scale';

import { IPriceScaleApi } from './iprice-scale-api';

export class PriceScaleApi implements IPriceScaleApi, IDestroyable {
	private _chartModel: ChartModel;

	public constructor(model: ChartModel) {
		this._chartModel = model;
	}

	public destroy(): void {
		delete this._chartModel;
	}

	public applyOptions(options: DeepPartial<PriceScaleOptions>): void {
		this._chartModel.applyOptions({ priceScale: options });
	}

	public options(): Readonly<PriceScaleOptions> {
		return this._priceScale().options();
	}

	public coordinateToPrice(coordinate: Coordinate, baseValue: number): BarPrice {
		return this._chartModel.mainPriceScale().coordinateToPrice(coordinate, baseValue);
	}

	private _priceScale(): PriceScale {
		return this._chartModel.mainPriceScale();
	}
}
