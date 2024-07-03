import React, { useState, useEffect, useMemo } from 'react';
import { FieldsTableComponent } from '../components/FieldsTable';
import { api } from '../services/api';
import Question from '../types/Question';
import QuestionModal from '../components/QuestionModal';

import Stomp from 'stompjs'

import WebSocketService from '../services/WebsocketService';

const itemsPerPage = 8;

const webSocketService: WebSocketService = new WebSocketService()


const FieldsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editQuestion, setEditQuestion] = useState<Question | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const webSocketService = useMemo<WebSocketService>(() => new WebSocketService(), [])

  useEffect(() => {
    webSocketService.connect();
    webSocketService.subscribe('/topic/questionsUpdated', handleQuestionsUpdated);
    return () => {
      webSocketService.unsubscribe('/topic/questionsUpdated');
    };
  }, [currentPage]);

  const handleQuestionsUpdated = async () => {
    let page: number = currentPage;
    const count = await api.getQuestionsCount(); setTotalQuestions(count)
    console.log(`count :${count}`);
    if (count !== totalQuestions) {
      console.log(`count != totalQuestoins`);
      
      const requiredPages = Math.ceil(count / itemsPerPage)
      console.log(`required pages: ${requiredPages}`);
      
      if (requiredPages <= currentPage) {
        page = currentPage - 1;
        setCurrentPage(current => current - 1)
      }
    }

    await fetchQuestions(page, itemsPerPage)
  };



  const fetchQuestions = async (offset: number, limit: number) => {
    console.log(`current page ${currentPage}`);

    setLoading(true);
    try {
      const questions = await api.getQuestions(offset, limit);
      console.log(`fetched questions with offset ${offset} and limit ${limit}: ${JSON.stringify(questions)}`);

      setQuestions(questions);
    } catch (error) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalQuestions = async () => {
    try {
      const totalItems = await api.getQuestionsCount();
      setTotalQuestions(() => totalItems);
    } catch (error) {
      setError('Failed to fetch questions count');
    }
  };

  useEffect(() => {
    fetchTotalQuestions();
    fetchQuestions(currentPage, itemsPerPage);

  }, [currentPage]);

  const handleAdd = () => {
    setModalMode('add');
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const questionToEdit = questions.find(q => q.id === id);
    if (questionToEdit) {
      setEditQuestion(questionToEdit);
      setModalMode('edit');
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteQuestion(id);
      const count = totalQuestions - 1;

    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditQuestion(undefined);
  };

  const handleSubmitQuestion = async (question: Question) => {
    try {
      if (modalMode === 'add') {
        await api.addQuestion(question);
      } else if (modalMode === 'edit' && editQuestion) {
        await api.updateQuestion(editQuestion.id!, question);
      }
      handleCloseModal();

    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Fields Page</h1>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add Question
      </button>
      <FieldsTableComponent
        questions={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalQuestions}
        onPageChange={setCurrentPage}
      />
      <QuestionModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuestion}
        isEditMode={modalMode === 'edit'}
        question={editQuestion}
      />
    </div>
  );
};

export default FieldsPage;
