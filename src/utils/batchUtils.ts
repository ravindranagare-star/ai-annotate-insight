// Utility functions for batch data management

export interface Batch {
  id: string;
  name: string;
  type: "fresh" | "qced";
  uploadDate: string;
  uploadedBy: string;
  jobCount: number;
  status: "processing" | "completed" | "error";
}

export interface Job {
  job_id: string;
  ref_id?: string;
  client_file_name?: string;
  client_file?: string;
  data_status?: string;
  making_date?: string;
  qc_name?: string;
  qc_date?: string;
  qc_status?: string;
  action?: string;
  assigned_to?: string;
  assigned_date?: string;
  assigned_by?: string;
  [key: string]: any;
}

export function getAllBatches(): Batch[] {
  // Get batches from localStorage
  const batchJobs = JSON.parse(localStorage.getItem('batchJobs') || '{}');
  const batchMetadata = JSON.parse(localStorage.getItem('batchMetadata') || '{}');
  
  const batches: Batch[] = [];
  
  // Add sample batches if they exist
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
  
  // Add sample batches
  batches.push(...sampleBatches);
  
  // Add dynamic batches from localStorage
  Object.keys(batchJobs).forEach(batchId => {
    if (!batches.find(b => b.id === batchId)) {
      const metadata = batchMetadata[batchId];
      batches.push({
        id: batchId,
        name: metadata?.name || batchId,
        type: metadata?.type || "fresh",
        uploadDate: metadata?.uploadDate || new Date().toISOString().split('T')[0],
        uploadedBy: metadata?.uploadedBy || "user@company.com",
        jobCount: batchJobs[batchId]?.length || 0,
        status: "completed"
      });
    }
  });
  
  return batches;
}

export function getBatchJobs(batchId: string): Job[] {
  const batchJobs = JSON.parse(localStorage.getItem('batchJobs') || '{}');
  
  if (batchJobs[batchId]) {
    return batchJobs[batchId];
  }
  
  // Return sample data for known batches
  if (batchId === "batch-1") {
    return [
      {
        job_id: "job-001",
        ref_id: "ref-001",
        client_file_name: "document_001.pdf",
        data_status: "completed",
        making_date: "2024-01-10",
        qc_name: "mayank.bisht@b2rtechnologies.com",
        qc_date: "2024-01-12",
        qc_status: "approved",
        action: "approved",
        assigned_to: "dimpal.arya@b2r.co.in",
        assigned_date: "2024-01-10",
        assigned_by: "admin@company.com"
      },
      {
        job_id: "job-002",
        ref_id: "ref-002",
        client_file_name: "document_002.pdf",
        data_status: "in_progress",
        making_date: "2024-01-11",
        qc_name: "pankaj.panwar@b2r.co.in",
        qc_date: "",
        qc_status: "pending",
        action: "pending",
        assigned_to: "harshita.arya@b2r.in",
        assigned_date: "2024-01-11",
        assigned_by: "admin@company.com"
      }
    ];
  }
  
  if (batchId === "batch-2") {
    return [
      {
        job_id: "job-101",
        ref_id: "attr-001",
        client_file_name: "attributes_001.json",
        data_status: "pending",
        making_date: "",
        qc_name: "",
        qc_date: "",
        qc_status: "",
        action: "",
        assigned_to: "",
        assigned_date: "",
        assigned_by: ""
      },
      {
        job_id: "job-102",
        ref_id: "attr-002",
        client_file_name: "attributes_002.json",
        data_status: "pending",
        making_date: "",
        qc_name: "",
        qc_date: "",
        qc_status: "",
        action: "",
        assigned_to: "",
        assigned_date: "",
        assigned_by: ""
      }
    ];
  }
  
  return [];
}

export function getAllJobs(): Job[] {
  const batches = getAllBatches();
  const allJobs: Job[] = [];
  
  batches.forEach(batch => {
    const jobs = getBatchJobs(batch.id);
    allJobs.push(...jobs);
  });
  
  return allJobs;
}

export function updateBatchJob(batchId: string, jobId: string, updates: Partial<Job>): boolean {
  try {
    const batchJobs = JSON.parse(localStorage.getItem('batchJobs') || '{}');
    
    if (!batchJobs[batchId]) {
      return false;
    }
    
    const jobIndex = batchJobs[batchId].findIndex((job: Job) => job.job_id === jobId);
    if (jobIndex === -1) {
      return false;
    }
    
    batchJobs[batchId][jobIndex] = { ...batchJobs[batchId][jobIndex], ...updates };
    localStorage.setItem('batchJobs', JSON.stringify(batchJobs));
    
    return true;
  } catch (error) {
    console.error('Error updating batch job:', error);
    return false;
  }
}

export function getJobCountsByStatus(batchId?: string) {
  let jobs: Job[] = [];
  
  if (batchId && batchId !== 'all') {
    jobs = getBatchJobs(batchId);
  } else {
    jobs = getAllJobs();
  }
  
  return jobs.reduce((acc, job) => {
    const status = job.data_status || 'pending';
    const qcStatus = job.qc_status;
    
    acc[status] = (acc[status] || 0) + 1;
    
    if (qcStatus && qcStatus !== 'pending') {
      acc[qcStatus] = (acc[qcStatus] || 0) + 1;
    }
    
    return acc;
  }, {} as Record<string, number>);
}