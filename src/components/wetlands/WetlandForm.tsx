import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useData, Wetland } from '../../contexts/DataContext';
import { Loader2 } from 'lucide-react';

interface WetlandFormProps {
  wetland?: Wetland | null;
  onClose: () => void;
}

export function WetlandForm({ wetland, onClose }: WetlandFormProps) {
  const { addWetland, updateWetland } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: wetland?.name || '',
    description: wetland?.description || '',
    area: wetland?.area?.toString() || '',
    type: wetland?.type || 'permanent',
    status: wetland?.status || 'healthy',
    latitude: wetland?.location.lat?.toString() || '',
    longitude: wetland?.location.lng?.toString() || '',
    sensors: wetland?.sensors.join(', ') || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Wetland name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.area || isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      setError('Please enter a valid area in hectares');
      return false;
    }
    if (!formData.latitude || isNaN(Number(formData.latitude)) || 
        Number(formData.latitude) < -90 || Number(formData.latitude) > 90) {
      setError('Please enter a valid latitude (-90 to 90)');
      return false;
    }
    if (!formData.longitude || isNaN(Number(formData.longitude)) || 
        Number(formData.longitude) < -180 || Number(formData.longitude) > 180) {
      setError('Please enter a valid longitude (-180 to 180)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const wetlandData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        area: Number(formData.area),
        type: formData.type as 'permanent' | 'seasonal' | 'artificial',
        status: formData.status as 'healthy' | 'degraded' | 'critical',
        location: {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude)
        },
        sensors: formData.sensors
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (wetland) {
        updateWetland(wetland.id, wetlandData);
      } else {
        addWetland(wetlandData);
      }

      onClose();
    } catch (err) {
      setError('An error occurred while saving the wetland data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Wetland Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Nyabugogo Wetland"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area (hectares) *</Label>
          <Input
            id="area"
            type="number"
            step="0.1"
            min="0"
            value={formData.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
            placeholder="e.g., 156.5"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the wetland, its characteristics, and any relevant information..."
          rows={3}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Wetland Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="seasonal">Seasonal</SelectItem>
              <SelectItem value="artificial">Artificial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Current Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="degraded">Degraded</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => handleInputChange('latitude', e.target.value)}
            placeholder="e.g., -1.9705"
            required
          />
          <p className="text-xs text-muted-foreground">Decimal degrees (-90 to 90)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => handleInputChange('longitude', e.target.value)}
            placeholder="e.g., 30.0644"
            required
          />
          <p className="text-xs text-muted-foreground">Decimal degrees (-180 to 180)</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sensors">Sensor IDs (Optional)</Label>
        <Input
          id="sensors"
          value={formData.sensors}
          onChange={(e) => handleInputChange('sensors', e.target.value)}
          placeholder="e.g., temp_001, ph_001, do_001 (comma-separated)"
        />
        <p className="text-xs text-muted-foreground">
          Enter sensor IDs separated by commas. Leave empty if no sensors are deployed yet.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {wetland ? 'Update Wetland' : 'Add Wetland'}
        </Button>
      </div>
    </form>
  );
}