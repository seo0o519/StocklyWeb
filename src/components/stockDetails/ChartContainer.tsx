import DayChart from './DayChart';
import MonthChart from './MonthChart';
import WeekChart from './WeekChart';
import YearChart from './YearChart';
import MinChart from './MinChart';
import { useState } from 'react';
import { NewStockData } from "../../types/NewStockData";

interface ChartContainerProps {
  symbol: string;
  newStockData: NewStockData;
}

const ChartContainer = ({ symbol, newStockData } : ChartContainerProps) => {
  const [filter, setFilter] = useState('day');
  // min, day, week, month, year

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full flex justify-between items-center h-[7%]">
        <p className="ml-[20px] text-[20px]">차트</p>
        <div>
          <select
            className={`w-[60px] h-[35px] mx-[5px] my-[10px] rounded-[7px] outline-none cursor-pointer text-center ${filter.includes('min') ? 'bg-gray' : 'bg-transparent'}`}
            onChange={(e) => setFilter(e.target.value)}
            value={filter.includes('min') ? filter : ""}
            defaultValue="" // select의 초기값 설정
          >
            <option value="" disabled>분</option>
            <option value="1min">1분</option>
            <option value="3min">3분</option>
            <option value="5min">5분</option>
            <option value="10min">10분</option>
            <option value="15min">15분</option>
            <option value="30min">30분</option>
            <option value="60min">60분</option>
          </select>
          <button
            className={`w-[35px] h-[35px] mx-[5px] my-[10px] rounded-[7px] transition-colors duration-300 ease-in-out ${filter === 'day' ? 'bg-gray' : 'bg-transparent'}`}
            onClick={() => {setFilter('day')}}
          >
            일
          </button>
          <button
            className={`w-[35px] h-[35px] mx-[5px] my-[10px] rounded-[7px] transition-colors duration-300 ease-in-out ${filter === 'week' ? 'bg-gray' : 'bg-transparent'}`}
            onClick={() => setFilter('week')}
          >
            주
          </button>
          <button
            className={`w-[35px] h-[35px] mx-[5px] my-[10px] rounded-[7px] transition-colors duration-300 ease-in-out ${filter === 'month' ? 'bg-gray' : 'bg-transparent'}`}
            onClick={() => setFilter('month')}
          >
            월
          </button>
          <button
            className={`w-[35px] h-[35px] mx-[5px] my-[10px] rounded-[7px] transition-colors duration-300 ease-in-out ${filter === 'year' ? 'bg-gray' : 'bg-transparent'}`}
            onClick={() => setFilter('year')}
          >
            년
          </button>
        </div>
        <div></div>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center w-full h-[93%]">
        {filter === '1min' && <MinChart symbol={symbol} newStockData={newStockData} filter={1}/>}
        {filter === '3min' && <MinChart symbol={symbol} newStockData={newStockData} filter={3}/>}
        {filter === '5min' && <MinChart symbol={symbol} newStockData={newStockData} filter={5}/>}
        {filter === '10min' && <MinChart symbol={symbol} newStockData={newStockData} filter={10}/>}
        {filter === '15min' && <MinChart symbol={symbol} newStockData={newStockData} filter={15}/>}
        {filter === '30min' && <MinChart symbol={symbol} newStockData={newStockData} filter={30}/>}
        {filter === '60min' && <MinChart symbol={symbol} newStockData={newStockData} filter={60}/>}
        {filter === 'day' && <DayChart symbol={symbol} newStockData={newStockData}/>}
        {filter === 'week' && <WeekChart symbol={symbol} newStockData={newStockData}/>}
        {filter === 'month' && <MonthChart symbol={symbol} newStockData={newStockData}/>}
        {filter === 'year' && <YearChart symbol={symbol} newStockData={newStockData}/>}
      </div>
    </div>
  );
};

export default ChartContainer;
