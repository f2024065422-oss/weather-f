import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
  ReferenceLine,
  Line
} from 'recharts';
import './TemperatureChart.css';

function TemperatureChart({ data, unit }) {
  if (!data || !data.list) return null;

  const dailyData = data.list.filter((_, i) => i % 8 === 0).slice(0, 7);

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
  };

  const getDayName = (timestamp) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(timestamp * 1000).getDay()];
  };

  const getFullDayName = (timestamp) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(timestamp * 1000).getDay()];
  };

  const getDate = (timestamp) => {
    return new Date(timestamp * 1000).getDate();
  };

  const chartData = dailyData.map((item) => ({
    day: getDayName(item.dt),
    fullDay: getFullDayName(item.dt),
    date: getDate(item.dt),
    high: convertTemp(item.main.temp_max),
    low: convertTemp(item.main.temp_min),
    avg: convertTemp((item.main.temp_max + item.main.temp_min) / 2),
    humidity: item.main.humidity,
    pop: Math.round((item.pop || 0) * 100)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-day">{payload[0].payload.fullDay}</p>
          <p className="tooltip-date">Date: {payload[0].payload.date}</p>
          <div className="tooltip-temps">
            <span className="tooltip-high">↑ {payload[0].payload.high}°{unit}</span>
            <span className="tooltip-low">↓ {payload[0].payload.low}°{unit}</span>
            <span className="tooltip-avg">↕ {payload[0].payload.avg}°{unit}</span>
          </div>
          <div className="tooltip-details">
            <span>💧 {payload[0].payload.humidity}%</span>
            <span>🌧️ {payload[0].payload.pop}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="custom-legend">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="temp-chart-container">
      <div className="temp-chart-header">
        <h4 className="temp-chart-title">📈 Temperature Trend</h4>
        <div className="temp-chart-stats">
          <span className="stat-high">▲ {Math.max(...chartData.map(d => d.high))}°{unit}</span>
          <span className="stat-low">▼ {Math.min(...chartData.map(d => d.low))}°{unit}</span>
          <span className="stat-avg">● {Math.round(chartData.reduce((a, b) => a + b.avg, 0) / chartData.length)}°{unit}</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4facfe" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.08)" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              width={40}
              tickFormatter={(value) => `${value}°`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend content={<CustomLegend />} />
            
            <ReferenceLine 
              y={chartData.reduce((a, b) => a + b.avg, 0) / chartData.length} 
              stroke="rgba(255,255,255,0.15)" 
              strokeDasharray="5 5"
              label={{ 
                value: 'Avg', 
                fill: 'rgba(255,255,255,0.3)', 
                fontSize: 10,
                position: 'insideRight'
              }}
            />
            
            <Bar 
              dataKey="low" 
              fill="#4facfe" 
              opacity={0.3}
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            
            <Bar 
              dataKey="high" 
              fill="#ff6b6b" 
              opacity={0.3}
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            
            <Line
              type="monotone"
              dataKey="high"
              stroke="#ff6b6b"
              strokeWidth={2.5}
              dot={{
                fill: '#ff6b6b',
                stroke: 'white',
                strokeWidth: 2,
                r: 5
              }}
              activeDot={{
                r: 8,
                stroke: 'white',
                strokeWidth: 2
              }}
            />
            
            <Line
              type="monotone"
              dataKey="low"
              stroke="#4facfe"
              strokeWidth={2.5}
              dot={{
                fill: '#4facfe',
                stroke: 'white',
                strokeWidth: 2,
                r: 5
              }}
              activeDot={{
                r: 8,
                stroke: 'white',
                strokeWidth: 2
              }}
            />
            
            <Area
              type="monotone"
              dataKey="avg"
              stroke="#ffd700"
              strokeWidth={1.5}
              fill="url(#areaGradient)"
              strokeDasharray="4 4"
              dot={{
                fill: '#ffd700',
                stroke: 'white',
                strokeWidth: 1,
                r: 3
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="temp-chart-footer">
        <div className="chart-legend-details">
          <span className="legend-dot high-dot"></span>
          <span>High</span>
          <span className="legend-dot low-dot"></span>
          <span>Low</span>
          <span className="legend-dot avg-dot"></span>
          <span>Average</span>
        </div>
        <div className="chart-range">
          <span>Range: {Math.min(...chartData.map(d => d.low))}°{unit} - {Math.max(...chartData.map(d => d.high))}°{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default TemperatureChart;