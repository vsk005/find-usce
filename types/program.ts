export interface ProgramEligibility {
  usmleSteps: string[];
  visaTypes: string[];
  graduationCutoff: string;
  clinicalExperience: string;
  additionalNotes: string;
}

export interface ProgramContact {
  email: string;
  phone: string;
  website: string;
  coordinatorName: string;
}

export interface Program {
  id: string;
  name: string;
  hospital: string;
  city: string;
  state: string;
  stateCode: string;
  specialty: string;
  subspecialty: string;
  eligibility: ProgramEligibility;
  fee: string;
  duration: string;
  contact: ProgramContact;
  applicationDeadline: string;
  acceptingApplications: boolean;
  lastVerified: string;
  lor: boolean;
  tags: string[];
  description: string;
}

export interface FilterOptions {
  search: string;
  state: string;
  specialty: string;
  usmleStep: string;
  visaType: string;
  lor: boolean | null;
  acceptingApplications: boolean | null;
  feeRange: string;
}
