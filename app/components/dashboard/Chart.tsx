"use client";

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface DataItem {
  date: string;
  revenue: number;
}

interface ChartProps {
  data: DataItem[];
}

interface AggregatedData {
  [date: string]: number;
}

const aggregateData = (data: DataItem[]): DataItem[] => {
  const aggregated: AggregatedData = data.reduce(
    (acc: AggregatedData, curr: DataItem) => {
      if (acc[curr.date]) {
        acc[curr.date] += curr.revenue;
      } else {
        acc[curr.date] = curr.revenue;
      }
      return acc;
    },
    {}
  );

  return Object.keys(aggregated).map((date) => ({
    date,
    revenue: aggregated[date],
  }));
};

export function Chart({ data }: ChartProps) {
  const processedData = aggregateData(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
          dataKey="revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
