import * as echarts from 'echarts';
import { HTMLAttributes, ReactElement, useContext, useRef } from 'react';
import { EChartsThemeContext } from './theme';
import { useInitialize } from '@/lib/useInitialize';
import { NextRequest } from 'next/server';
import Head from 'next/head';
import { SetOptionOpts } from 'echarts/types/dist/echarts';

const browser = typeof window !== 'undefined';

// It's just like useEffect, but make sure use it inside echarts.inspect
type WatchSource<T extends any[]> = [T, (...args: T) => echarts.EChartsOption, SetOptionOpts?]

export interface EchartsProps<I extends WatchSource<any>[]> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: I;
  // true: og:image
  // ['foo', 'bar']: <meta name="foo" ...> <meta name="bar" ...>
  ssrMeta?: boolean | string[];
  request?: NextRequest;
}

export function once (options: echarts.EChartsOption, opts?: SetOptionOpts): WatchSource<[]> {
  return [[], () => options, opts];
}

export function watch<T extends any[]> (values: T, cb: (...args: T) => echarts.EChartsOption, opts?: SetOptionOpts): WatchSource<T> {
  return [values, cb, opts];
}

function getSizeFromRequest (request: NextRequest | undefined): { width: number, height: number } {
  // Twitter now
  return {
    width: 800,
    height: 418,
  };
}

export default function ECharts<I extends WatchSource<any>[]> ({ children, request, ssrMeta = false, ...props }: EchartsProps<I>) {
  const elRef = useRef<HTMLDivElement>(null);
  const ecRef = useRef<echarts.EChartsType>();

  const { theme } = useContext(EChartsThemeContext);

  // for client
  useInitialize(browser => {
    const el = elRef.current;
    if (browser) {
      if (!el) {
        return;
      }
      const { width, height } = getComputedStyle(el);
      const ec = ecRef.current = echarts.init(el, theme, {
        width: parseInt(width),
        height: parseInt(height),
        renderer: 'canvas',
      });

      return () => {
        ec.dispose();
      };
    } else {
      ecRef.current = echarts.init(null as never, theme, {
        ...(getSizeFromRequest(request)),
        renderer: 'svg',
        ssr: true,
      });
    }
  });

  for (let i = 0; i < children.length; i++) {
    const [deps, getOptions, opts] = children[i];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInitialize(() => {
      const ec = ecRef.current;
      if (ec) {
        ec.setOption(getOptions(...deps), opts);
      }
    }, deps);
  }

  if (browser) {
    return (
      <div ref={elRef} suppressHydrationWarning={true} {...props} dangerouslySetInnerHTML={{ __html: '' }} />
    );
  } else {
    let ssrContent = ecRef.current?.renderToSVGString() ?? '';
    ecRef.current?.setOption({
      animation: false,
    });
    if (ssrContent) {
      ssrContent = `<div style="display: none;">${ssrContent}</div>`
    }
    return (
      <>
        {/*{renderMeta(ssrMeta, ssrContent)}*/}
        <div ref={elRef} suppressHydrationWarning={true} {...props} dangerouslySetInnerHTML={{ __html: ssrContent }} />
      </>
    );
  }
}
