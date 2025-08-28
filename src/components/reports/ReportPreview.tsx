import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportPreviewProps {
  reportData: any;
}

export function ReportPreview({ reportData }: ReportPreviewProps) {
  const { wetland, readings, summary } = reportData;

  // Prepare chart data for different sensor types
  const temperatureData = readings
    .filter((r: any) => r.sensorType === 'temperature')
    .slice(-20)
    .map((reading: any) => ({
      time: new Date(reading.timestamp).toLocaleDateString(),
      value: reading.value,
      status: reading.status
    }));

  const phData = readings
    .filter((r: any) => r.sensorType === 'ph')
    .slice(-20)
    .map((reading: any) => ({
      time: new Date(reading.timestamp).toLocaleDateString(),
      value: reading.value,
      status: reading.status
    }));

  const statusDistribution = [
    { 
      name: 'Normal', 
      count: readings.filter((r: any) => r.status === 'normal').length,
      fill: '#10b981'
    },
    { 
      name: 'Warning', 
      count: readings.filter((r: any) => r.status === 'warning').length,
      fill: '#f59e0b'
    },
    { 
      name: 'Critical', 
      count: readings.filter((r: any) => r.status === 'critical').length,
      fill: '#ef4444'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getHealthTrend = () => {
    if (summary.criticalAlerts > summary.warningAlerts) {
      return { icon: TrendingDown, color: 'text-red-600', text: 'Declining' };
    } else if (summary.criticalAlerts === 0 && summary.warningAlerts < 5) {
      return { icon: TrendingUp, color: 'text-green-600', text: 'Improving' };
    } else {
      return { icon: TrendingUp, color: 'text-yellow-600', text: 'Stable' };
    }
  };

  const healthTrend = getHealthTrend();

  return (
    <div className="space-y-6">
      {/* Wetland Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(wetland.status)}
                {wetland.name}
              </CardTitle>
              <CardDescription>
                {wetland.type} wetland • {wetland.area} hectares
              </CardDescription>
            </div>
            <Badge 
              variant={wetland.status === 'healthy' ? 'default' : 
                      wetland.status === 'degraded' ? 'secondary' : 'destructive'}
              className="capitalize"
            >
              {wetland.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{wetland.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Location:</span>
              <p className="font-medium">{wetland.location.lat.toFixed(4)}, {wetland.location.lng.toFixed(4)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Active Sensors:</span>
              <p className="font-medium">{wetland.sensors.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Health Trend:</span>
              <p className={`font-medium flex items-center gap-1 ${healthTrend.color}`}>
                <healthTrend.icon className="h-3 w-3" />
                {healthTrend.text}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <p className="font-medium">{new Date(wetland.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalReadings}</div>
            <p className="text-xs text-muted-foreground">Data points collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgTemperature.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Period average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg pH Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgPH.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Acidity/alkalinity</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Temperature Trend */}
        {temperatureData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Temperature Trend</CardTitle>
              <CardDescription>Daily temperature readings over the report period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: any) => [`${value}°C`, 'Temperature']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* pH Level Trend */}
        {phData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">pH Level Trend</CardTitle>
              <CardDescription>Water acidity/alkalinity measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={phData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis fontSize={12} domain={[0, 14]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: any) => [`${value}`, 'pH Level']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alert Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alert Status Distribution</CardTitle>
          <CardDescription>Breakdown of sensor reading statuses during the report period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: any) => [`${value}`, 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Critical Events */}
      {summary.criticalAlerts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Critical Events Summary
            </CardTitle>
            <CardDescription>
              Most severe environmental readings requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {readings
                .filter((r: any) => r.status === 'critical')
                .slice(0, 5)
                .map((reading: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                    <div>
                      <p className="font-medium text-sm">
                        {reading.sensorType.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reading.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-700">
                        {reading.value} {reading.unit}
                      </p>
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}