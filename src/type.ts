export interface Student {
  id: number;  // 添加 id 字段
  firstname: string;
  surname: string;
  studentId: string;
  studentPw: string;
  department: string;
  images: string[];
  advisor: Teacher | null | undefined;
}

export interface Teacher {
  id: number;
  teacherId: string;
  academicPosition: string;
  firstname: string;
  surname: string;
  department: string;
  JoinedDate: string;
  profileImage: string;
  advisee: Student[];
  name?: string;  // 可选的 name 字段，如果需要
}
