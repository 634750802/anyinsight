// It's just like useEffect, but make sure use it inside echarts.inspect
import * as echarts from 'echarts';
import { SetOptionOpts } from 'echarts/types/dist/echarts';

export type WatchSource<T extends any[]> = [T, (...args: T) => echarts.EChartsOption, SetOptionOpts?]

export function once (options: echarts.EChartsOption, opts?: SetOptionOpts): WatchSource<[]> {
  return [[], () => options, opts];
}

export function watch<T extends any[]> (values: [...T], cb: (...args: T) => echarts.EChartsOption, opts?: SetOptionOpts): WatchSource<T> {
  return [values, cb, opts];
}

export type ChartOptionTemplate<T extends any[]> = (...data: T) => WatchSource<any>[];

export function buildOptions (ec: echarts.EChartsType, sources: WatchSource<any>[]): void {
  for (const [deps, fn, opts] of sources) {
    ec.setOption(fn(...deps), opts);
  }
}
