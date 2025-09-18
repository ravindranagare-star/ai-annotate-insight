import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CSVImportModal } from "@/components/CSVImportModal";
import { getAllBatches, getBatchJobs, type Batch, type Job } from "@/utils/batchUtils";
import { 
  Upload, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  UserPlus,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Interfaces are now imported from utils

export function BatchManagementTab() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const jobsPerPage = 20;

  useEffect(() => {
    // Load all batches using utility function
    setBatches(getAllBatches());
  }, []);

  const handleImport = async (importData: any) => {
    // Parse CSV and create batch
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      
      // Create new batch metadata
      const batchId = importData.batchId.toLowerCase();
      const newBatch: Batch = {
        id: batchId,
        name: importData.batchName,
        type: importData.dataType,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: "current.user@company.com",
        jobCount: rows.length,
        status: "completed"
      };
      
      // Store batch metadata
      const batchMetadata = JSON.parse(localStorage.getItem('batchMetadata') || '{}');
      batchMetadata[batchId] = {
        name: newBatch.name,
        type: newBatch.type,
        uploadDate: newBatch.uploadDate,
        uploadedBy: newBatch.uploadedBy,
        status: newBatch.status
      };
      localStorage.setItem('batchMetadata', JSON.stringify(batchMetadata));
      
      setBatches(getAllBatches());
      
      // Create jobs from CSV - preserve ALL columns
      const newJobs: Job[] = rows.map(row => {
        const job: any = {};
        headers.forEach((header, index) => {
          job[header] = row[index] || '';
        });
        
        // For fresh data, ensure QC fields exist but are empty
        if (importData.dataType === 'fresh') {
          job.data_status = job.data_status || '';
          job.making_date = job.making_date || '';
          job.qc_name = job.qc_name || '';
          job.qc_date = job.qc_date || '';
          job.qc_status = job.qc_status || '';
          job.action = job.action || '';
          job.assigned_to = job.assigned_to || '';
          job.assigned_date = job.assigned_date || '';
          job.assigned_by = job.assigned_by || '';
        }
        
        return job as Job;
      });
      
      // Store jobs data by batch ID for later retrieval
      const batchJobs = JSON.parse(localStorage.getItem('batchJobs') || '{}');
      batchJobs[batchId] = newJobs;
      localStorage.setItem('batchJobs', JSON.stringify(batchJobs));
      
      // If this is the selected batch, update jobs immediately
      if (selectedBatch?.id === batchId) {
        setJobs(newJobs);
      }
    };
    reader.readAsText(importData.file);
  };

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
    setSelectedJobs([]);
    
    // Load jobs using utility function
    const batchJobs = getBatchJobs(batch.id);
    setJobs(batchJobs);
  };

  const handleJobSelection = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs(prev => [...prev, jobId]);
    } else {
      setSelectedJobs(prev => prev.filter(id => id !== jobId));
    }
  };

  const handleBulkAssign = () => {
    // Implementation for bulk assignment
    console.log("Bulk assign jobs:", selectedJobs);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      Object.values(job).some(value => 
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = statusFilter === "all" || job.data_status === statusFilter;
    const matchesAssignee = assigneeFilter === "all" || job.assigned_to === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (selectedBatch) {
    return (
      <div className="space-y-6">
        {/* Batch Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedBatch(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Batches
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">{selectedBatch.name}</h2>
              <p className="text-muted-foreground">
                {selectedBatch.jobCount} jobs • {selectedBatch.type} data • Uploaded {selectedBatch.uploadDate}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, IDs, or Boolean query (e.g., status=completed AND assigned_to=user)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="dimpal.arya@b2r.co.in">Dimpal Arya</SelectItem>
                  <SelectItem value="harshita.arya@b2r.in">Harshita Arya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedJobs.length} jobs selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleBulkAssign}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Bulk Assign
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark Complete
                  </Button>
                  <Button size="sm" variant="outline">
                    Export Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">
                      <Checkbox
                        checked={selectedJobs.length === paginatedJobs.length && paginatedJobs.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobs(paginatedJobs.map(job => job.job_id));
                          } else {
                            setSelectedJobs([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Job ID</th>
                    <th className="text-left py-3 px-4 font-medium">Ref ID</th>
                    <th className="text-left py-3 px-4 font-medium">Client File</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Making Date</th>
                    <th className="text-left py-3 px-4 font-medium">QC Name</th>
                    <th className="text-left py-3 px-4 font-medium">QC Date</th>
                    <th className="text-left py-3 px-4 font-medium">QC Status</th>
                    <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map((job) => (
                    <tr key={job.job_id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedJobs.includes(job.job_id)}
                          onCheckedChange={(checked) => handleJobSelection(job.job_id, checked as boolean)}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{job.job_id}</td>
                      <td className="py-3 px-4 text-muted-foreground">{job.ref_id || '-'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{job.client_file_name || job.client_file || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          job.data_status === 'completed' ? 'default' :
                          job.data_status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {job.data_status || 'pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{job.making_date || '-'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{job.qc_name || '-'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{job.qc_date || '-'}</td>
                      <td className="py-3 px-4">
                        {job.qc_status && (
                          <Badge variant={
                            job.qc_status === 'approved' ? 'default' :
                            job.qc_status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {job.qc_status}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{job.assigned_to || 'Unassigned'}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Open Workspace</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Batch Management</h2>
          <p className="text-muted-foreground">Upload and manage annotation data batches</p>
        </div>
        <Button onClick={() => setShowImportModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
      </div>

      {/* Batch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleBatchSelect(batch)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{batch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{batch.id}</p>
                </div>
                <Badge variant={batch.type === "fresh" ? "secondary" : "default"}>
                  {batch.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {batch.uploadDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {batch.uploadedBy}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {batch.jobCount} jobs
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={
                    batch.status === 'completed' ? 'default' :
                    batch.status === 'processing' ? 'secondary' : 'destructive'
                  }>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {batch.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleBatchSelect(batch);
                  }}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import Modal */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
}