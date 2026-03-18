export interface AcademicDegree {
  id: string;
  name: string;
  abbrevFem: string;
  abbrevMas: string;
  abbrevFemId: string;
  abbrevMasId: string;
  createdAt: Date;
}

export interface CreateAcademicDegreeInput {
  name: string;
  abbrevFem: string;
  abbrevMas: string;
}

export interface UpdateAcademicDegreeInput {
  id: string;
  name: string;
  abbrevFem: string;
  abbrevMas: string;
  abbrevFemId: string;
  abbrevMasId: string;
}
