import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CSVImportModal } from "@/components/CSVImportModal";
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

interface Batch {
  id: string;
  name: string;
  type: "fresh" | "qced";
  uploadDate: string;
  uploadedBy: string;
  jobCount: number;
  status: "processing" | "completed" | "error";
}

interface Job {
  job_id: string;
  ref_id?: string;
  client_file_name?: string;
  data_status?: string;
  making_date?: string;
  qc_name?: string;
  qc_date?: string;
  qc_status?: string;
  action?: string;
  assigned_to?: string;
  assigned_date?: string;
  assigned_by?: string;
}

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
    // Load sample batches
    const sampleBatches: Batch[] = [
      {
        id: "batch-1",
        name: "Editor Performance Q1",
        type: "qced",
        uploadDate: "2024-01-15",
        uploadedBy: "admin@company.com",
        jobCount: 41,
        status: "completed"
      },
      {
        id: "batch-2", 
        name: "Attribute Errors Analysis",
        type: "fresh",
        uploadDate: "2024-01-14",
        uploadedBy: "manager@company.com", 
        jobCount: 49,
        status: "completed"
      }
    ];
    setBatches(sampleBatches);
  }, []);

  const handleImport = async (importData: any) => {
    // Parse CSV and create batch
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      
      // Create new batch
      const newBatch: Batch = {
        id: importData.batchId.toLowerCase(),
        name: importData.batchName,
        type: importData.dataType,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: "current.user@company.com",
        jobCount: rows.length,
        status: "completed"
      };
      
      setBatches(prev => [newBatch, ...prev]);
      
      // Create jobs from CSV
      const newJobs: Job[] = rows.map(row => {
        const job: Partial<Job> = {};
        headers.forEach((header, index) => {
          (job as any)[header] = row[index];
        });
        return job as Job;
      });
      
      // If this is the selected batch, update jobs
      if (selectedBatch?.id === newBatch.id) {
        setJobs(newJobs);
      }
    };
    reader.readAsText(importData.file);
  };

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
    
    // Load sample jobs for selected batch
    if (batch.id === "batch-1") {
      // Editor performance data
      const sampleJobs: Job[] = [
        {
          job_id: "job-001",
          ref_id: "ref-001", 
          client_file_name: "document_001.pdf",
          data_status: "completed",
          qc_name: "mayank.bisht@b2rtechnologies.com",
          qc_status: "approved",
          assigned_to: "dimpal.arya@b2r.co.in"
        },
        {
          job_id: "job-002",
          ref_id: "ref-002",
          client_file_name: "document_002.pdf", 
          data_status: "in_progress",
          qc_name: "pankaj.panwar@b2r.co.in",
          qc_status: "pending",
          assigned_to: "harshita.arya@b2r.in"
        }
      ];
      setJobs(sampleJobs);
    } else {
      setJobs([]);
    }
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
                    <th className="text-left py-3 px-4 font-medium">Client File</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">QC Name</th>
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
                      <td className="py-3 px-4 text-muted-foreground">{job.client_file_name || job.ref_id}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          job.data_status === 'completed' ? 'default' :
                          job.data_status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {job.data_status || 'pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{job.qc_name || '-'}</td>
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