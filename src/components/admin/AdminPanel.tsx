import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserManagement } from './UserManagement';
import { SystemStats } from './SystemStats';
import { Settings, Users, BarChart3, Database, Shield, AlertTriangle } from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuth();
  const { wetlands, sensorReadings } = useData();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need administrator privileges to access this panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = 3; // Mock data - in real app this would come from user management system
  const activeUsers = 2;
  const totalReadings = sensorReadings.length;
  const criticalAlerts = sensorReadings.filter(r => r.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>System Administration</h1>
        <p className="text-muted-foreground">
          Manage users, monitor system health, and configure Ka-Eco settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wetlands</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wetlands.length}</div>
            <p className="text-xs text-muted-foreground">
              {wetlands.filter(w => w.status === 'healthy').length} healthy sites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensor Readings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReadings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full lg:w-auto grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            System Statistics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <SystemStats />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Retention */}
              <div className="space-y-3">
                <h4 className="font-medium">Data Retention</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sensor Data Retention (days)</label>
                    <Input type="number" defaultValue="365" />
                    <p className="text-xs text-muted-foreground">
                      How long to keep sensor reading data
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Archive (days)</label>
                    <Input type="number" defaultValue="1095" />
                    <p className="text-xs text-muted-foreground">
                      How long to keep generated reports
                    </p>
                  </div>
                </div>
              </div>

              {/* Alert Thresholds */}
              <div className="space-y-3">
                <h4 className="font-medium">Alert Thresholds</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Critical pH Range</label>
                    <div className="flex gap-2">
                      <Input type="number" step="0.1" defaultValue="5.5" placeholder="Min" />
                      <Input type="number" step="0.1" defaultValue="9.0" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Critical Temperature (°C)</label>
                    <div className="flex gap-2">
                      <Input type="number" defaultValue="5" placeholder="Min" />
                      <Input type="number" defaultValue="40" placeholder="Max" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Critical DO (mg/L)</label>
                    <Input type="number" step="0.1" defaultValue="3.0" placeholder="Min" />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-3">
                <h4 className="font-medium">Notification Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for critical alerts
                      </p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Send SMS for immediate critical issues
                      </p>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Recipients</label>
                    <Input defaultValue="admin@ka-eco.rw, alerts@rema.gov.rw" />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated email addresses
                    </p>
                  </div>
                </div>
              </div>

              {/* System Maintenance */}
              <div className="space-y-3">
                <h4 className="font-medium">System Maintenance</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Database
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate System Report
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}