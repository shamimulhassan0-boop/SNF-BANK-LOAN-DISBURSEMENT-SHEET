
export interface ReportHeader {
  bankName: string;
  mfiName: string;
  disbursementArea: string;
  reportPeriod: string;
}

export interface LoanEntry {
  id: string;
  userId: string; // User's mobile number
  branchName: string;
  borrowerInfo: string; 
  upazila: string;
  district: string;
  loanSector: string;
  disbursementDate: string;
  loanAmount: number;
  interestRate: string;
  totalInterest: number;
  otherCollections: number;
  loanDuration: string;
  installmentCount: string;
  installmentAmount: number;
  passbookUpdated: boolean;
  collectionStartDate: string;
  inspectionComments: string;
  isSynced?: boolean;
}

export interface InspectionReport {
  header: ReportHeader;
  entries: LoanEntry[];
}
