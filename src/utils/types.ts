export interface Experience {
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
}
export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  tokens: number;
  description: string;
  title: string;
  experiences: Experience[];
  educations: Experience[];
}

export interface Resume {
  id: number;
  title: string;
  userId: string;
  experiences: Experience[];
  educations: Experience[];
  jobDescription: string;
  description: string;
}
