
export interface ReportHeader {
  bankName: string;
  mfiName: string;
  disbursementArea: string;
  reportPeriod: string;
}

export interface LoanEntry {
  id: string;
  branchName: string;
  borrowerInfo: string; // Name, Husband's Name, Village, Mobile
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
  isSynced?: boolean; // Track if already saved to cloud
}

export interface InspectionReport {
  header: ReportHeader;
  entries: LoanEntry[];
}
