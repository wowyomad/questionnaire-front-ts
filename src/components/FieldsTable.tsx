import React from 'react';
import Question from '../types/Question';
import { QuestionComponent } from './QuestionComponent';
import Pagination from './Pagination';

type QuestionsTableProps = {
  questions: Question[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export const FieldsTableComponent: React.FC<QuestionsTableProps> = ({
  questions,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
          {questions.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">No fields</td>
            </tr>
          )}
          {questions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              index={currentPage * itemsPerPage + index}
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
        onPageChange={onPageChange}
      />
    </div>
  );
};
