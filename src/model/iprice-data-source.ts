// NOTE: this type definition file is incomplete. Feel free to define other entities from companion JS

import { IFormatter } from '../formatters/iformatter';

import { AutoscaleInfo } from './autoscale-info';
import { ChartModel } from './chart-model';
import { IDataSource } from './idata-source';
import { TimePointIndex } from './time-data';

export interface IPriceDataSource extends IDataSource {
	firstValue(): number | null;
	formatter(): IFormatter;
	priceLineColor(lastBarColor: string): string;
	model(): ChartModel;
	minMove(): number;
	autoscaleInfo(startTimePoint: TimePointIndex, endTimePoint: TimePointIndex): AutoscaleInfo;
}
