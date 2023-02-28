import * as echarts from 'echarts';
import { HTMLAttributes, useContext, useEffect, useRef } from 'react';
import { EChartsThemeContext } from './theme';
import { WatchSource } from '@/components/Chart/option-builder';

export interface EchartsProps<I extends WatchSource<any>[]> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: I;
}

export default function ECharts<I extends WatchSource<any>[]> ({ children, ...props }: EchartsProps<I>) {
  const elRef = useRef<HTMLDivElement>(null);
  const ecRef = useRef<echarts.EChartsType>();

  const { theme } = useContext(EChartsThemeContext);

  // for client
  useEffect(() => {
    const el = elRef.current;
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
  });

  for (let i = 0; i < children.length; i++) {
    const [deps, getOptions, opts] = children[i];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const ec = ecRef.current;
      if (ec) {
        ec.setOption(getOptions(...deps), opts);
      }
    }, deps);
  }

  return (
    <div ref={elRef} suppressHydrationWarning={true} {...props} />
  );
}
