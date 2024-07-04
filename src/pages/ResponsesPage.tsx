import React, { useState, useEffect, useMemo } from 'react';
import ResponsesTable from '../components/ResponsesTable';
import { getQuestions, getSubmissions, deleteSubmission, api } from '../services/api';
import Question from '../types/Question';
import Submission from '../types/Submission';
import WebSocketService from '../services/WebsocketService';

const itemsPerPage = 8;

const ResponsesPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const webSocketService = useMemo<WebSocketService>(() => new WebSocketService(), []);

  useEffect(() => {
    webSocketService.connect();
    webSocketService.subscribe('/topic/submissionsUpdated', handleSubmissionsUpdated);
   // webSocketService.subscribe('/topic/questionsUpdated', handleQuestinosUpdated)
    return () => {
      webSocketService.unsubscribe('/topic/submissionsUpdated');
    };
  }, [currentPage]);

  const handleQuestinosUpdated = async () => {
    console.info('Got a message of new questions');
    await fetchQuestions();
  }


  const handleSubmissionsUpdated = async () => {
    console.info('Got a message of new submission');

    let page: number = currentPage;
    const count = await api.getSubmissionsCount();
    setTotalSubmissions(count);

    if (count !== totalSubmissions) {
      const requiredPages = Math.ceil(count / itemsPerPage);
      if (requiredPages <= currentPage) {
        page = currentPage - 1;
        setCurrentPage(current => current - 1);
      }
    }

    await fetchSubmissions(page, itemsPerPage);
  };

  useEffect(() => {
    fetchTotalSubmissions();
    fetchSubmissions(currentPage, itemsPerPage);
  }, [currentPage]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter(q => q.active);
    setActiveQuestions(() => filtered);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      const questionsData = await getQuestions();
      setQuestions(questionsData);
    } catch (error) {
      setError('Failed to fetch questions');
    }
  };

  const fetchSubmissions = async (offset: number, limit: number) => {
    setLoading(true);
    try {
      const submissionsData = await api.getSubmissions(offset, limit);
      setSubmissions(submissionsData);
    } catch (error) {
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalSubmissions = async () => {
    try {
      const totalItems = await api.getSubmissionsCount();
      setTotalSubmissions(() => totalItems);
    } catch (error) {
      setError('Failed to fetch submissions count');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubmission(id);
      handleSubmissionsUpdated();
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
        questions={activeQuestions}
        submissions={submissions}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalSubmissions}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ResponsesPage;
