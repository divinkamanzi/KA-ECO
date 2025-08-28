import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useData, Wetland } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { WetlandForm } from './WetlandForm';
import { Plus, Search, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

export function WetlandManagement() {
  const { wetlands, deleteWetland } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWetland, setSelectedWetland] = useState<Wetland | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [wetlandToDelete, setWetlandToDelete] = useState<string | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'researcher';

  // Filter wetlands based on search term
  const filteredWetlands = wetlands.filter(wetland =>
    wetland.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wetland.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wetland.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (wetland: Wetland) => {
    setSelectedWetland(wetland);
    setIsFormOpen(true);
  };

  const handleDelete = (wetlandId: string) => {
    setWetlandToDelete(wetlandId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (wetlandToDelete) {
      deleteWetland(wetlandToDelete);
      setWetlandToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedWetland(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-orange-100 text-orange-800';
      case 'artificial': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Wetland Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage wetland sites across Rwanda
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Wetland
          </Button>
        )}
      </div>

      {!canEdit && (
        <Alert>
          <AlertDescription>
            You have read-only access. Contact an administrator to add or modify wetland data.
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search wetlands by name, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Wetlands Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWetlands.map((wetland) => (
          <Card key={wetland.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{wetland.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {wetland.location.lat.toFixed(4)}, {wetland.location.lng.toFixed(4)}
                    </div>
                  </CardDescription>
                </div>
                {canEdit && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(wetland)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(wetland.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {wetland.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(wetland.status)}>
                    {wetland.status}
                  </Badge>
                  <Badge className={getTypeColor(wetland.type)}>
                    {wetland.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <span className="ml-1 font-medium">{wetland.area} ha</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sensors:</span>
                    <span className="ml-1 font-medium">{wetland.sensors.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Updated {new Date(wetland.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWetlands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No wetlands found matching your search criteria.</p>
        </div>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWetland ? 'Edit Wetland' : 'Add New Wetland'}
            </DialogTitle>
            <DialogDescription>
              {selectedWetland 
                ? 'Update the wetland information below.'
                : 'Enter the details for the new wetland site.'
              }
            </DialogDescription>
          </DialogHeader>
          <WetlandForm 
            wetland={selectedWetland} 
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wetland</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wetland? This action cannot be undone and will remove all associated sensor data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}