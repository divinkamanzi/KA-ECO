import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useData } from '../../contexts/DataContext';

export function SensorChart() {
  const { sensorReadings, wetlands } = useData();
  const [selectedWetland, setSelectedWetland] = useState(wetlands[0]?.id || '');
  const [selectedSensor, setSelectedSensor] = useState('temperature');

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const filteredReadings = sensorReadings
      .filter(r => r.wetlandId === selectedWetland && r.sensorType === selectedSensor)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-24); // Last 24 readings

    return filteredReadings.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      }),
      value: Number(reading.value.toFixed(2)),
      status: reading.status,
      unit: reading.unit
    }));
  }, [sensorReadings, selectedWetland, selectedSensor]);

  const selectedWetlandData = wetlands.find(w => w.id === selectedWetland);

  const getLineColor = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature': return '#ef4444';
      case 'ph': return '#3b82f6';
      case 'dissolved_oxygen': return '#10b981';
      case 'water_quality': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  const getSensorLabel = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature': return 'Temperature';
      case 'ph': return 'pH Level';
      case 'dissolved_oxygen': return 'Dissolved Oxygen';
      case 'water_quality': return 'Water Quality Index';
      default: return sensorType;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Wetland</label>
          <Select value={selectedWetland} onValueChange={setSelectedWetland}>
            <SelectTrigger>
              <SelectValue placeholder="Select wetland" />
            </SelectTrigger>
            <SelectContent>
              {wetlands.map(wetland => (
                <SelectItem key={wetland.id} value={wetland.id}>
                  {wetland.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Sensor Type</label>
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger>
              <SelectValue placeholder="Select sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">Temperature (°C)</SelectItem>
              <SelectItem value="ph">pH Level</SelectItem>
              <SelectItem value="dissolved_oxygen">Dissolved Oxygen (mg/L)</SelectItem>
              <SelectItem value="water_quality">Water Quality Index</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                fontSize={12}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                fontSize={12}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: any, name: any, props: any) => [
                  `${value} ${props.payload?.unit || ''}`,
                  getSensorLabel(selectedSensor)
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getLineColor(selectedSensor)}
                strokeWidth={2}
                dot={{ fill: getLineColor(selectedSensor), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name={getSensorLabel(selectedSensor)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          <p>No sensor data available for the selected wetland and sensor type.</p>
        </div>
      )}

      {selectedWetlandData && (
        <div className="text-sm text-muted-foreground">
          <p><strong>Location:</strong> {selectedWetlandData.name}</p>
          <p><strong>Status:</strong> <span className={`capitalize ${
            selectedWetlandData.status === 'healthy' ? 'text-green-600' : 
            selectedWetlandData.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
          }`}>{selectedWetlandData.status}</span></p>
          <p><strong>Last Updated:</strong> {new Date(selectedWetlandData.lastUpdated).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}