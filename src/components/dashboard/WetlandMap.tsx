import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useData } from '../../contexts/DataContext';
import { MapPin, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';

export function WetlandMap() {
  const { wetlands } = useData();
  const [selectedWetland, setSelectedWetland] = useState<string | null>(null);

  // For this demo, we'll create a simple visual map representation
  // In a real application, you would integrate with Leaflet.js or Mapbox

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Droplets className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedWetlandData = wetlands.find(w => w.id === selectedWetland);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 h-80 overflow-hidden">
        {/* Simple visual representation of Rwanda */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-sm max-h-80">
            {/* Rwanda outline placeholder */}
            <div className="absolute inset-0 border-2 border-gray-300 rounded-lg bg-green-50 opacity-50"></div>
            
            {/* Wetland markers */}
            {wetlands.map((wetland, index) => (
              <div
                key={wetland.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                  selectedWetland === wetland.id ? 'scale-125 z-10' : ''
                }`}
                style={{
                  left: `${30 + (index * 20)}%`,
                  top: `${20 + (index * 15)}%`,
                }}
                onClick={() => setSelectedWetland(wetland.id === selectedWetland ? null : wetland.id)}
              >
                <div className={`w-4 h-4 rounded-full ${getStatusColor(wetland.status)} shadow-lg border-2 border-white`}>
                </div>
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white px-2 py-1 rounded shadow-sm text-xs font-medium">
                    {wetland.name.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-medium text-sm mb-2">Status</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Healthy</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Degraded</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wetland List */}
      <div className="space-y-2">
        <h4 className="font-medium">Monitored Wetlands</h4>
        <div className="grid gap-2">
          {wetlands.map((wetland) => (
            <Card
              key={wetland.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedWetland === wetland.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedWetland(wetland.id === selectedWetland ? null : wetland.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(wetland.status)}
                  <div>
                    <p className="font-medium text-sm">{wetland.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {wetland.area} hectares • {wetland.type}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={wetland.status === 'healthy' ? 'default' : 
                          wetland.status === 'degraded' ? 'secondary' : 'destructive'}
                  className="capitalize"
                >
                  {wetland.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Wetland Details */}
      {selectedWetlandData && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium">{selectedWetlandData.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedWetlandData.description}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Area:</span>
                  <span className="ml-2">{selectedWetlandData.area} hectares</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 capitalize">{selectedWetlandData.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sensors:</span>
                  <span className="ml-2">{selectedWetlandData.sensors.length} active</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="ml-2">{new Date(selectedWetlandData.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center">
        <p>Interactive map showing wetland locations across Rwanda</p>
        <p className="mt-1">In production: Integrate with Leaflet.js or Mapbox for real mapping functionality</p>
      </div>
    </div>
  );
}