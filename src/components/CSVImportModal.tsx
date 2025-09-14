import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ImportData) => void;
}

interface ImportData {
  file: File;
  dataType: "fresh" | "qced";
  batchName: string;
  batchId: string;
}

interface ValidationError {
  type: "missing_columns" | "duplicate_ids" | "invalid_dates" | "schema_mismatch";
  message: string;
  rows?: number[];
}

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<"fresh" | "qced">("fresh");
  const [batchName, setBatchName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);

  const generateBatchId = () => {
    const batchCount = localStorage.getItem("batchCount") || "0";
    const nextBatch = parseInt(batchCount) + 1;
    return `Batch-${nextBatch}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setValidationErrors([]);
      setIsValid(false);
      validateCSV(selectedFile);
    }
  };

  const validateCSV = async (file: File) => {
    setIsValidating(true);
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    
    setCsvPreview([headers, ...rows.slice(0, 5)]); // Show first 5 rows
    
    const errors: ValidationError[] = [];
    
    // Schema validation based on data type
    const requiredColumns = dataType === "fresh" 
      ? ["job_id", "ref_id", "client_file_name"]
      : ["job_id", "client_file", "data_status", "making_date", "qc_name", "qc_date", "qc_status", "action"];
    
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      errors.push({
        type: "missing_columns",
        message: `Missing required columns: ${missingColumns.join(", ")}`
      });
    }
    
    // Check for duplicate job_ids
    const jobIds = rows.map(row => row[headers.indexOf("job_id")]).filter(Boolean);
    const duplicateIds = jobIds.filter((id, index) => jobIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push({
        type: "duplicate_ids",
        message: `Duplicate job_ids found: ${[...new Set(duplicateIds)].join(", ")}`
      });
    }
    
    // Validate date formats for QC'ed data
    if (dataType === "qced") {
      const dateColumns = ["making_date", "qc_date"];
      dateColumns.forEach(col => {
        const colIndex = headers.indexOf(col);
        if (colIndex !== -1) {
          rows.forEach((row, index) => {
            const dateValue = row[colIndex];
            if (dateValue && isNaN(Date.parse(dateValue))) {
              errors.push({
                type: "invalid_dates",
                message: `Invalid date format in ${col} at row ${index + 2}: ${dateValue}`
              });
            }
          });
        }
      });
    }
    
    setValidationErrors(errors);
    setIsValid(errors.length === 0);
    setIsValidating(false);
  };

  const handleImport = () => {
    if (!file || !isValid) return;
    
    const finalBatchName = batchName.trim() || generateBatchId();
    const batchId = generateBatchId();
    
    // Update batch counter
    const currentCount = localStorage.getItem("batchCount") || "0";
    localStorage.setItem("batchCount", (parseInt(currentCount) + 1).toString());
    
    onImport({
      file,
      dataType,
      batchName: finalBatchName,
      batchId
    });
    
    // Reset form
    setFile(null);
    setBatchName("");
    setValidationErrors([]);
    setIsValid(false);
    setCsvPreview([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import CSV Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground"
            />
          </div>

          {/* Data Type Selection */}
          <div className="space-y-3">
            <Label>Data Type</Label>
            <RadioGroup value={dataType} onValueChange={(value) => setDataType(value as "fresh" | "qced")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fresh" id="fresh" />
                <Label htmlFor="fresh">Fresh Data (New annotations)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qced" id="qced" />
                <Label htmlFor="qced">QC'ed Data (Quality controlled)</Label>
              </div>
            </RadioGroup>
            
            {/* Schema Requirements */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Required Columns:</h4>
                {dataType === "fresh" ? (
                  <p className="text-sm text-muted-foreground">
                    job_id, ref_id, client_file_name
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    job_id, client_file, data_status, making_date, qc_name, qc_date, qc_status, action
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Batch Name */}
          <div className="space-y-2">
            <Label htmlFor="batch-name">Batch Name (Optional)</Label>
            <Input
              id="batch-name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder={`Auto-generated: ${generateBatchId()}`}
            />
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="space-y-2">
              <Label>CSV Preview (First 5 rows)</Label>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {csvPreview[0]?.map((header, index) => (
                        <th key={index} className="px-3 py-2 text-left font-medium border-r">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 border-r text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validation Results */}
          {isValidating && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Validating CSV structure...</AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <X className="h-4 w-4" />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {isValid && file && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                CSV validation passed! Ready to import {file.name}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!isValid || !file}
              className="min-w-24"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}