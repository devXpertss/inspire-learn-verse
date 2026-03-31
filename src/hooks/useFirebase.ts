import { useState, useEffect } from "react";
import { db, ref, onValue, get } from "@/lib/firebase";
import type { Subject, Unit, Topic, Note, Quiz } from "@/lib/types";

export function useFirebaseData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        setData(snapshot.val() as T);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
}

export function useSubjects() {
  return useFirebaseData<Record<string, Subject>>("subjects");
}

export function useQuizzes() {
  return useFirebaseData<Record<string, Quiz>>("quizzes");
}
