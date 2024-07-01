import React, { useState, useEffect } from 'react';
import ResponsesTable from '../components/ResponsesTable';
import { getQuestions, getSubmissions, deleteSubmission } from '../services/api'; 
import Question from '../types/Question'; 
import Submission from '../types/Submission';

const ResponsesPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsData = await getQuestions(); 
        const submissionsData = await getSubmissions();
        setQuestions(questionsData);
        setSubmissions(submissionsData);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteSubmission(id);
      setSubmissions(submissions.filter(submission => submission.id !== id));
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Responses</h1>
      <ResponsesTable
        questions={questions}
        submissions={submissions}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ResponsesPage;
