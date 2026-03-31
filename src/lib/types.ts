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

export interface Presentation {
  id?: string;
  title: string;
  description: string;
  category?: string;
  image?: string;
  thumbnail?: string;
  embedUrl?: string;
  fileUrl?: string;
  slides?: Slide[];
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
  presentations?: Record<string, Presentation>;
  siteContent?: SiteContent;
}

export interface SiteContent {
  brand: Record<string, string>;
  navigation: {
    items: Array<{ path: string; label: string }>;
    searchPlaceholder: string;
  };
  footer: {
    description: string;
    copyright: string;
    learnLinks: Array<{ label: string; path: string }>;
    connectLinks: Array<{ label: string; path: string; external?: boolean }>;
    resourceLinks: Array<{ label: string; path: string; external?: boolean }>;
  };
  home: Record<string, any>;
  pages: Record<string, any>;
  contact: Record<string, any>;
  search: Record<string, string>;
}
