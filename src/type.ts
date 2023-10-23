export interface Student {
  firstname: string;
  surname: string;
  studentId: string;
  profileImage: string;
  department: string;
  images: string[];
  comment: [];
  advisor: Teacher;
}

export interface Teacher {
  id: number;
  academicPosition: string;
  firstname: string;
  surname: string;
  department: string;
  JoinedDate: string;
  profileImage: string;
  teacherId: string;
  advisee: Student[];
}