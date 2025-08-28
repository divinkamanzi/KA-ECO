import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { SensorChart } from './SensorChart';
import { WetlandMap } from './WetlandMap';
import { AlertTriangle, Droplets, Leaf, Thermometer, Activity } from 'lucide-react';

export function Dashboard() {
  const { wetlands, sensorReadings } = useData();
  const { user } = useAuth();

  // Calculate key metrics
  const totalWetlands = wetlands.length;
  const criticalWetlands = wetlands.filter(w => w.status === 'critical').length;
  const healthyWetlands = wetlands.filter(w => w.status === 'healthy').length;
  const degradedWetlands = wetlands.filter(w => w.status === 'degraded').length;

  // Get recent critical alerts
  const recentCriticalReadings = sensorReadings
    .filter(r => r.status === 'critical')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Calculate average metrics for the last 24 hours
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentReadings = sensorReadings.filter(r => r.timestamp >= last24Hours);
  
  const avgTemp = recentReadings
    .filter(r => r.sensorType === 'temperature')
    .reduce((sum, r) => sum + r.value, 0) / recentReadings.filter(r => r.sensorType === 'temperature').length || 0;

  const avgPH = recentReadings
    .filter(r => r.sensorType === 'ph')
    .reduce((sum, r) => sum + r.value, 0) / recentReadings.filter(r => r.sensorType === 'ph').length || 0;

  const avgWaterQuality = recentReadings
    .filter(r => r.sensorType === 'water_quality')
    .reduce((sum, r) => sum + r.value, 0) / recentReadings.filter(r => r.sensorType === 'water_quality').length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Monitor and analyze wetland environmental data across Rwanda
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wetlands</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWetlands}</div>
            <p className="text-xs text-muted-foreground">
              {healthyWetlands} healthy, {degradedWetlands} degraded, {criticalWetlands} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWaterQuality.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              WQI Score (0-100)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pH Level</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPH.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average across sites
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Map */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sensor Data Trends</CardTitle>
            <CardDescription>
              Real-time environmental monitoring data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SensorChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wetland Locations</CardTitle>
            <CardDescription>
              Interactive map of monitored wetlands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WetlandMap />
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {recentCriticalReadings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Critical Alerts
            </CardTitle>
            <CardDescription>
              Sensor readings requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCriticalReadings.map((reading) => {
                const wetland = wetlands.find(w => w.id === reading.wetlandId);
                return (
                  <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{wetland?.name || 'Unknown Wetland'}</p>
                      <p className="text-sm text-muted-foreground">
                        {reading.sensorType.replace('_', ' ').toUpperCase()}: {reading.value} {reading.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Critical</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(reading.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}