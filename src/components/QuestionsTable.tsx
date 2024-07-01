import React from 'react';
import Question from '../types/Question';
import { QuestionComponent } from './QuestionComponent';

type QuestionsTableProps = {
  questions: Question[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const QuestionsTableComponent: React.FC<QuestionsTableProps> = ({ questions, onEdit, onDelete }) => {
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
          {questions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              index={index}
              question={question}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
