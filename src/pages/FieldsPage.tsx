import React, { useState, useEffect } from 'react';
import { FieldsTableComponent } from '../components/FieldsTable';
import { api } from '../services/api';
import Question from '../types/Question';
import QuestionModal from '../components/QuestionModal';

const FieldsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editQuestion, setEditQuestion] = useState<Question | undefined>(undefined);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsData = await api.getQuestions(); 
        setQuestions(questionsData);
      } catch (error) {
        setError('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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
      setQuestions(questions.filter(q => q.id !== id));
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
      let updatedQuestion: Question | undefined = undefined;
      let addedQuestion: Question | undefined = undefined;

      if (modalMode === 'add') {
        addedQuestion = await api.addQuestion(question);
      } else if (modalMode === 'edit' && editQuestion) {
        updatedQuestion = await api.updateQuestion(editQuestion.id!, question);
      }

      if(addedQuestion) {
        setQuestions([...questions, addedQuestion])
        handleCloseModal();
      }
      else if (updatedQuestion) {
        const updatedQuestions = questions.map(q => q.id === updatedQuestion!.id ? updatedQuestion! : q);
        setQuestions(updatedQuestions);
        handleCloseModal();
      }


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
      <FieldsTableComponent questions={questions} onEdit={handleEdit} onDelete={handleDelete} />

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
