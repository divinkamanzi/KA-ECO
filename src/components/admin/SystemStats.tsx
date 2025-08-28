import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';

export function SystemStats() {
  const { wetlands, sensorReadings } = useData();

  // Calculate system statistics
  const stats = useMemo(() => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentReadings = sensorReadings.filter(r => new Date(r.timestamp) >= last7Days);
    const todayReadings = sensorReadings.filter(r => new Date(r.timestamp) >= last24Hours);

    return {
      totalWetlands: wetlands.length,
      healthyWetlands: wetlands.filter(w => w.status === 'healthy').length,
      criticalWetlands: wetlands.filter(w => w.status === 'critical').length,
      totalSensors: wetlands.reduce((sum, w) => sum + w.sensors.length, 0),
      totalReadings: sensorReadings.length,
      recentReadings: recentReadings.length,
      todayReadings: todayReadings.length,
      criticalAlerts: sensorReadings.filter(r => r.status === 'critical').length,
      warningAlerts: sensorReadings.filter(r => r.status === 'warning').length,
      systemUptime: '99.8%', // Mock uptime
      avgResponseTime: '142ms' // Mock response time
    };
  }, [wetlands, sensorReadings]);

  // Prepare chart data
  const dailyReadingsData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayReadings = sensorReadings.filter(r => {
        const readingDate = new Date(r.timestamp);
        return readingDate >= dayStart && readingDate < dayEnd;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        readings: dayReadings.length,
        critical: dayReadings.filter(r => r.status === 'critical').length,
        warning: dayReadings.filter(r => r.status === 'warning').length,
        normal: dayReadings.filter(r => r.status === 'normal').length
      });
    }
    return last7Days;
  }, [sensorReadings]);

  const wetlandStatusData = [
    { name: 'Healthy', value: stats.healthyWetlands, color: '#10b981' },
    { name: 'Degraded', value: wetlands.filter(w => w.status === 'degraded').length, color: '#f59e0b' },
    { name: 'Critical', value: stats.criticalWetlands, color: '#ef4444' }
  ];

  const sensorTypeData = useMemo(() => {
    const types = ['temperature', 'ph', 'dissolved_oxygen', 'water_quality'];
    return types.map(type => ({
      type: type.replace('_', ' ').toUpperCase(),
      count: sensorReadings.filter(r => r.sensorType === type).length
    }));
  }, [sensorReadings]);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">API response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReadings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentReadings} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3GB</div>
            <p className="text-xs text-muted-foreground">of 100GB allocated</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Readings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sensor Readings</CardTitle>
            <CardDescription>
              Data collection trends over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyReadingsData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="readings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Total Readings"
                  />
                  <Line
                    type="monotone"
                    dataKey="critical"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    name="Critical Alerts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wetland Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Wetland Health Status</CardTitle>
            <CardDescription>
              Distribution of wetland health across all monitored sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wetlandStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wetlandStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Data Distribution</CardTitle>
          <CardDescription>
            Number of readings by sensor type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sensorTypeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="type" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Connection:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Backup:</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Records:</span>
                <span>{stats.totalReadings.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Endpoint Health:</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Requests/min:</span>
                <span>45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Error Rate:</span>
                <span>0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alert Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Critical:</span>
                <Badge variant="destructive">{stats.criticalAlerts}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Warning:</span>
                <Badge variant="secondary">{stats.warningAlerts}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Alert:</span>
                <span>15 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}