export interface Note {
  id: string;
  title: string;
  content: string;
  type: "text" | "ppt";
  slides?: Slide[];
}

export interface Slide {
  title: string;
  content: string;
  image?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  notes: Record<string, Note>;
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  topics: Record<string, Topic>;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  units: Record<string, Unit>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: QuizQuestion[];
}

export interface FirebaseData {
  subjects: Record<string, Subject>;
  quizzes: Record<string, Quiz>;
}
