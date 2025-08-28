import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Wetland {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  area: number; // in hectares
  type: 'permanent' | 'seasonal' | 'artificial';
  status: 'healthy' | 'degraded' | 'critical';
  lastUpdated: string;
  description: string;
  sensors: string[];
}

export interface SensorReading {
  id: string;
  wetlandId: string;
  sensorType: 'water_quality' | 'vegetation' | 'pollution' | 'temperature' | 'ph' | 'dissolved_oxygen';
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

interface DataContextType {
  wetlands: Wetland[];
  sensorReadings: SensorReading[];
  addWetland: (wetland: Omit<Wetland, 'id' | 'lastUpdated'>) => void;
  updateWetland: (id: string, wetland: Partial<Wetland>) => void;
  deleteWetland: (id: string) => void;
  getLatestReadings: (wetlandId: string) => SensorReading[];
  generateReport: (wetlandId: string, dateRange: { start: string; end: string }) => any;
}

const DataContext = createContext<DataContextType | null>(null);

// Mock data
const initialWetlands: Wetland[] = [
  {
    id: '1',
    name: 'Nyabugogo Wetland',
    location: { lat: -1.9705, lng: 30.0644 },
    area: 156.5,
    type: 'permanent',
    status: 'degraded',
    lastUpdated: '2024-12-19T10:30:00Z',
    description: 'Major wetland system in Kigali, currently facing pollution challenges from urban runoff.',
    sensors: ['temp_001', 'ph_001', 'do_001', 'wq_001']
  },
  {
    id: '2',
    name: 'Kimisagara Wetland',
    location: { lat: -1.9659, lng: 30.0588 },
    area: 89.2,
    type: 'seasonal',
    status: 'healthy',
    lastUpdated: '2024-12-19T09:15:00Z',
    description: 'Seasonal wetland with good biodiversity, community involvement in conservation.',
    sensors: ['temp_002', 'ph_002', 'veg_001']
  },
  {
    id: '3',
    name: 'Gikondo Industrial Wetland',
    location: { lat: -1.9847, lng: 30.0878 },
    area: 203.7,
    type: 'permanent',
    status: 'critical',
    lastUpdated: '2024-12-19T11:45:00Z',
    description: 'Industrial wetland requiring immediate intervention due to heavy metal contamination.',
    sensors: ['temp_003', 'ph_003', 'poll_001', 'wq_002']
  },
  {
    id: '4',
    name: 'Rwampara Wetland',
    location: { lat: -1.9441, lng: 30.0619 },
    area: 67.3,
    type: 'artificial',
    status: 'healthy',
    lastUpdated: '2024-12-19T08:20:00Z',
    description: 'Artificially constructed wetland for wastewater treatment, performing well.',
    sensors: ['temp_004', 'ph_004', 'do_002']
  }
];

// Generate mock sensor readings
function generateMockReadings(): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();

  initialWetlands.forEach(wetland => {
    // Generate readings for the last 30 days
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString();
      
      // Temperature readings
      readings.push({
        id: `temp_${wetland.id}_${i}`,
        wetlandId: wetland.id,
        sensorType: 'temperature',
        value: 20 + Math.random() * 15,
        unit: '°C',
        timestamp,
        status: 'normal'
      });

      // pH readings
      const phValue = 6 + Math.random() * 3;
      readings.push({
        id: `ph_${wetland.id}_${i}`,
        wetlandId: wetland.id,
        sensorType: 'ph',
        value: phValue,
        unit: 'pH',
        timestamp,
        status: phValue < 6.5 || phValue > 8.5 ? 'warning' : 'normal'
      });

      // Dissolved Oxygen
      const doValue = 4 + Math.random() * 8;
      readings.push({
        id: `do_${wetland.id}_${i}`,
        wetlandId: wetland.id,
        sensorType: 'dissolved_oxygen',
        value: doValue,
        unit: 'mg/L',
        timestamp,
        status: doValue < 5 ? 'critical' : doValue < 7 ? 'warning' : 'normal'
      });

      // Water Quality Index
      const wqValue = 40 + Math.random() * 50;
      readings.push({
        id: `wq_${wetland.id}_${i}`,
        wetlandId: wetland.id,
        sensorType: 'water_quality',
        value: wqValue,
        unit: 'WQI',
        timestamp,
        status: wqValue < 50 ? 'critical' : wqValue < 70 ? 'warning' : 'normal'
      });
    }
  });

  return readings;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [wetlands, setWetlands] = useState<Wetland[]>(initialWetlands);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    // Initialize with mock sensor readings
    setSensorReadings(generateMockReadings());

    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      const newReadings: SensorReading[] = [];

      wetlands.forEach(wetland => {
        // Generate new readings for each wetland
        const tempReading: SensorReading = {
          id: `temp_${wetland.id}_${Date.now()}`,
          wetlandId: wetland.id,
          sensorType: 'temperature',
          value: 20 + Math.random() * 15,
          unit: '°C',
          timestamp: now,
          status: 'normal'
        };

        const phValue = 6 + Math.random() * 3;
        const phReading: SensorReading = {
          id: `ph_${wetland.id}_${Date.now()}`,
          wetlandId: wetland.id,
          sensorType: 'ph',
          value: phValue,
          unit: 'pH',
          timestamp: now,
          status: phValue < 6.5 || phValue > 8.5 ? 'warning' : 'normal'
        };

        newReadings.push(tempReading, phReading);
      });

      setSensorReadings(prev => [...newReadings, ...prev.slice(0, 1000)]); // Keep only latest 1000 readings
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [wetlands]);

  const addWetland = (wetlandData: Omit<Wetland, 'id' | 'lastUpdated'>) => {
    const newWetland: Wetland = {
      ...wetlandData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    setWetlands(prev => [...prev, newWetland]);
  };

  const updateWetland = (id: string, updates: Partial<Wetland>) => {
    setWetlands(prev => prev.map(wetland => 
      wetland.id === id 
        ? { ...wetland, ...updates, lastUpdated: new Date().toISOString() }
        : wetland
    ));
  };

  const deleteWetland = (id: string) => {
    setWetlands(prev => prev.filter(wetland => wetland.id !== id));
    setSensorReadings(prev => prev.filter(reading => reading.wetlandId !== id));
  };

  const getLatestReadings = (wetlandId: string): SensorReading[] => {
    return sensorReadings
      .filter(reading => reading.wetlandId === wetlandId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  };

  const generateReport = (wetlandId: string, dateRange: { start: string; end: string }) => {
    const wetland = wetlands.find(w => w.id === wetlandId);
    const readings = sensorReadings.filter(r => 
      r.wetlandId === wetlandId &&
      r.timestamp >= dateRange.start &&
      r.timestamp <= dateRange.end
    );

    return {
      wetland,
      readings,
      summary: {
        totalReadings: readings.length,
        criticalAlerts: readings.filter(r => r.status === 'critical').length,
        warningAlerts: readings.filter(r => r.status === 'warning').length,
        avgTemperature: readings
          .filter(r => r.sensorType === 'temperature')
          .reduce((sum, r) => sum + r.value, 0) / readings.filter(r => r.sensorType === 'temperature').length || 0,
        avgPH: readings
          .filter(r => r.sensorType === 'ph')
          .reduce((sum, r) => sum + r.value, 0) / readings.filter(r => r.sensorType === 'ph').length || 0
      }
    };
  };

  return (
    <DataContext.Provider
      value={{
        wetlands,
        sensorReadings,
        addWetland,
        updateWetland,
        deleteWetland,
        getLatestReadings,
        generateReport
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}