
import React, { useState } from 'react';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getRecordsByPatientId } from '@/data/mockEhrData';
import { MedicalRecord, RecordType } from '@/types/ehr';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Activity, FileText, FlaskConical, Syringe, HeartPulse, Image, FileText as FileIcon, Filter, Search, Eye } from 'lucide-react';

const MedicalRecords: React.FC<{ patientId?: string }> = ({ patientId }) => {
  const { user } = useEhrAuth();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterText, setFilterText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<RecordType[]>([]);
  
  if (!user) return null;
  
  // Use the provided patientId (for provider view) or the logged-in user's id (for patient view)
  const recordsPatientId = patientId || (user.role === 'patient' ? user.id : '');
  const records = getRecordsByPatientId(recordsPatientId);
  
  // Filter records by type and search text
  const filteredRecords = records.filter(record => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(record.type);
    const matchesSearch = filterText === '' || 
      record.title.toLowerCase().includes(filterText.toLowerCase()) ||
      record.description.toLowerCase().includes(filterText.toLowerCase()) ||
      record.providerName.toLowerCase().includes(filterText.toLowerCase());
    
    return matchesType && matchesSearch;
  });
  
  // Group records by year for the timeline view
  const recordsByYear = filteredRecords.reduce((acc, record) => {
    const year = new Date(record.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {} as Record<string, MedicalRecord[]>);
  
  // Sort years in descending order
  const sortedYears = Object.keys(recordsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  
  const getRecordTypeIcon = (type: RecordType) => {
    switch (type) {
      case 'visit':
        return <CalendarDays className="h-5 w-5" />;
      case 'diagnosis':
        return <Activity className="h-5 w-5" />;
      case 'prescription':
        return <FileText className="h-5 w-5" />;
      case 'lab':
        return <FlaskConical className="h-5 w-5" />;
      case 'vaccination':
        return <Syringe className="h-5 w-5" />;
      case 'vitals':
        return <HeartPulse className="h-5 w-5" />;
      case 'imaging':
        return <Image className="h-5 w-5" />;
      case 'note':
        return <FileIcon className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5" />;
    }
  };
  
  const recordTypes: { value: RecordType; label: string }[] = [
    { value: 'visit', label: 'Visits' },
    { value: 'diagnosis', label: 'Diagnoses' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'lab', label: 'Lab Results' },
    { value: 'vaccination', label: 'Vaccinations' },
    { value: 'vitals', label: 'Vitals' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'note', label: 'Notes' },
  ];
  
  const handleTypeToggle = (type: RecordType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">
            View and manage health records secured by blockchain
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex-none md:w-1/3">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <div className="relative">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start pl-9">
                    {selectedTypes.length > 0 
                      ? `${selectedTypes.length} types selected` 
                      : "Filter by record type"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter by Record Type</DialogTitle>
                    <DialogDescription>
                      Select the types of medical records you want to view
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {recordTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-${type.value}`}
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={() => handleTypeToggle(type.value)}
                        />
                        <label
                          htmlFor={`filter-${type.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTypes([])}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => setSelectedTypes(recordTypes.map(t => t.value))}
                    >
                      Select All
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Timeline</CardTitle>
              <CardDescription>Chronological view of medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecords.length > 0 ? (
                <div className="relative border-l border-muted pl-6 ml-6">
                  {sortedYears.map((year) => (
                    <div key={year} className="mb-10">
                      <div className="absolute -left-3 mt-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{year}</span>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold">{year}</h3>
                        <div className="mt-3 space-y-6">
                          {recordsByYear[year]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((record) => (
                              <div key={record.id} className="relative">
                                <div className="absolute -left-12 mt-0.5 w-3 h-3 rounded-full bg-primary/50"></div>
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {new Date(record.date).toLocaleDateString()}
                                    </span>
                                    <Badge variant="outline" className="ml-2">
                                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                    <div className="mt-1 p-2 rounded-md bg-muted">
                                      {getRecordTypeIcon(record.type)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-base font-medium">{record.title}</h4>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setSelectedRecord(record)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {record.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Provider: {record.providerName}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10">
                  <div className="mb-4 flex justify-center">
                    <FileIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {filterText || selectedTypes.length > 0
                      ? "Try adjusting your search or filters"
                      : "There are no medical records available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Records List</CardTitle>
              <CardDescription>Tabular view of medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecords.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <div 
                        key={record.id} 
                        className="flex items-start gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 rounded-md bg-muted">
                          {getRecordTypeIcon(record.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium">{record.title}</h4>
                                <Badge variant="outline">
                                  {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {record.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>Provider: {record.providerName}</span>
                              <span className="mx-2">•</span>
                              <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Hash: {record.blockchainHash?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center p-10">
                  <div className="mb-4 flex justify-center">
                    <FileIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {filterText || selectedTypes.length > 0
                      ? "Try adjusting your search or filters"
                      : "There are no medical records available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Detail Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedRecord.title}</DialogTitle>
              <DialogDescription>
                Record created on {new Date(selectedRecord.date).toLocaleDateString()} by {selectedRecord.providerName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Badge>{selectedRecord.type.charAt(0).toUpperCase() + selectedRecord.type.slice(1)}</Badge>
                <span className="text-xs text-muted-foreground">
                  Last modified: {new Date(selectedRecord.lastModified).toLocaleString()}
                </span>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-medium">Description</h4>
                <p className="text-sm">{selectedRecord.description}</p>
              </div>
              
              {selectedRecord.details && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Details</h4>
                  <div className="rounded-md border p-4 text-sm">
                    {selectedRecord.type === 'prescription' ? (
                      // Special rendering for prescriptions
                      <div className="space-y-4">
                        {selectedRecord.details.medications.map((medication: any, idx: number) => (
                          <div key={idx} className="space-y-1 pb-3 border-b last:border-0">
                            <div className="font-medium">{medication.name} ({medication.dosage})</div>
                            <div>Frequency: {medication.frequency}</div>
                            <div>Duration: {medication.duration}</div>
                          </div>
                        ))}
                        <div>Refills: {selectedRecord.details.refills}</div>
                      </div>
                    ) : (
                      // Generic rendering for other record types
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(selectedRecord.details).map(([key, value]) => (
                          <div key={key} className="col-span-2 sm:col-span-1">
                            <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                            <dd className="text-muted-foreground">{value as string}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>
              )}
              
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Attachments</h4>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-md border p-3">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {attachment.type.split('/')[1]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <h4 className="mb-2 text-sm font-medium">Blockchain Verification</h4>
                <div className="rounded-md bg-muted p-3 text-xs font-mono break-all">
                  {selectedRecord.blockchainHash}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This record has been securely stored and verified on the blockchain network
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MedicalRecords;
