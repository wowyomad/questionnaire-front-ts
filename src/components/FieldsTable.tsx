import React, { useState } from 'react';
import Question from '../types/Question';
import { QuestionComponent } from './QuestionComponent';
import Pagination from './Pagination';

type QuestionsTableProps = {
  questions: Question[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const FieldsTableComponent: React.FC<QuestionsTableProps> = ({ questions, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mt-4">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Label</th>
            <th>Type</th>
            <th>Text</th>
            <th>Options</th>
            <th>Active</th>
            <th>Required</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              index={startIndex + index}
              question={question}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
