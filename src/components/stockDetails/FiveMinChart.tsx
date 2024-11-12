import Echart from './Echart';
import { EChartOption, ECElementEvent } from 'echarts';
import { useEffect, useState, useRef } from 'react';

interface StockData {
  date: string;
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
  rate: number;
  rate_price: number;
  symbol: string;
}

interface SplitData {
  categoryData: string[];
  values: [number, number, number, number][];
  volumes: [number, number, number][];
}

interface FiveMinChartProps {
  symbol: string;
}

const OneMinChart = ({symbol} : FiveMinChartProps) => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [data, setData] = useState<SplitData>();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const zoomRange = useRef({ start: 80, end: 100 }); // 줌 상태 저장

  // 과거 데이터 및 1분마다 들어오는 데이터
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost.stock-service/api/v1/stockDetails/streamFilter?symbol=${symbol}&interval=5m`,
    );
    eventSource.onmessage = (event) => {
      setIsDataLoaded(false);
      const newData = JSON.parse(event.data);
      const dummyData = {
        date: "",
        open: 0, 
        low: 0,
        high: 0,
        close: 0,
        volume: 0,
        rate: 0,
        rate_price: 0,
        symbol: ""
      }
      if (newData.length === 1) {
        setStockData((prev) => [...prev.slice(0,-1), newData[0], dummyData]);
        setIsDataLoaded(true);
      } else {
        setStockData([...newData, dummyData]);
        setIsDataLoaded(true);
      }
    };
    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [symbol]);

  useEffect(() => {
    setData(splitData(stockData));
  }, [stockData]);


  // 초단위로 실시간 데이터
  useEffect(() => {
    if (!isDataLoaded) return;
    const eventSource = new EventSource(`http://localhost.stock-service/api/v1/stockDetails/stream/${symbol}`);
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      const formattedDate = `${newData.date.slice(0, 2)}:${newData.date.slice(2, 4)}:${newData.date.slice(4, 6)}`;

      setStockData((prevStockData) => {
        const updatedStockData = [...prevStockData];

        if (updatedStockData.length > 0) {
          updatedStockData[updatedStockData.length - 1] = {
            ...updatedStockData[updatedStockData.length - 1],
            date: formattedDate,
            ...newData, // 새로운 데이터로 수정
          };
        }

        return updatedStockData; // 수정된 배열 반환
      });
    };
    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  },[isDataLoaded, symbol]);

  // 줌 상태 관리
  const onDataZoom = (event: ECElementEvent) => {
    if (event.batch) {
      const start = event.batch[0].start;
      const end = event.batch[0].end;
      zoomRange.current = { start, end };
    }
  };
  const onEvents = {
    dataZoom: onDataZoom,
  };



  if (!data) {
    return <div>Loading...</div>;
  }

  const upColor = '#fe4a4a';
  const downColor = '#5235f2';

  function splitData(rawData: StockData[]): SplitData {
    const categoryData: string[] = [];
    const values: [number, number, number, number][] = [];
    const volumes: [number, number, number][] = [];

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];
      categoryData.push(item.date);
      values.push([item.open, item.close, item.low, item.high]);
      volumes.push([i, item.volume, item.open > item.close ? 1 : -1]);
    }

    return {
      categoryData,
      values,
      volumes,
    };
  }

  function calculateMA(dayCount: number, data: SplitData) {
    const result = [];
    for (let i = 0; i < data.values.length; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }

      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data.values[i - j][1]; // 'close' 값 (index 1)을 사용하여 이동 평균 계산
      }
      result.push((sum / dayCount).toFixed(3));
    }
    return result;
  }

  const ChartOption: EChartOption = {
    animation: false,
    legend: {
      top: 10,
      left: 'left',
      data: ['주가', 'MA5', 'MA10', 'MA20', 'MA30'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: { color: '#000' },
    },

    axisPointer: {
      link: [{ xAxisIndex: 'all' }],
      label: { backgroundColor: '#777' },
    },
    toolbox: {
      feature: {
        brush: { type: ['lineX', 'clear'] },
      },
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: { colorAlpha: 0.1 },
    },
    visualMap: [
      {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          { value: 1, color: downColor },
          { value: -1, color: upColor },
        ],
      },
    ],
    grid: [
      { left: '0%', right: '8%', height: '60%' },
      { left: '0%', right: '8%', top: '63%', height: '26%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisLabel: {
          formatter: function (value: string) {
            const time = value.slice(0, 5);
            return time;
          },
        },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: { show: true },
        position: 'right',
        axisLabel: {
          showMinLabel: false,
          showMaxLabel: false,
          inside: true,
        },
        // min: (value) => value.min - (value.max - value.min) * 0.1,
        // max: (value) => value.max + (value.max - value.min) * 0.5, 
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [{ type: 'inside', xAxisIndex: [0, 1], start: zoomRange.current.start, end: zoomRange.current.end }],
    series: [
      {
        name: '주가',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upColor,
          borderColor0: downColor,
        },
      },
      { name: 'MA5', type: 'line', data: calculateMA(5, data), smooth: true, lineStyle: { opacity: 0.5 } },
      { name: 'MA10', type: 'line', data: calculateMA(10, data), smooth: true, lineStyle: { opacity: 0.5 } },
      { name: 'MA20', type: 'line', data: calculateMA(20, data), smooth: true, lineStyle: { opacity: 0.5 } },
      { name: 'MA30', type: 'line', data: calculateMA(30, data), smooth: true, lineStyle: { opacity: 0.5 } },
      { name: '거래량', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: data.volumes },
    ],
  };

  return <Echart chartOption={ChartOption} onEvents={onEvents}/>;
};
export default OneMinChart;