import React from 'react';
import Question from '../types/Question';
import Option from '../types/Option';
import { capitalizeFirstLetter } from '../services/helpers';

type QuestionProps = {
  question: Question;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const QuestionComponent: React.FC<QuestionProps> = ({ question, index, onEdit, onDelete }) => {
  let typeDisplayName: string = capitalizeFirstLetter(question.type).replaceAll('_', ' ');

  const handleEdit = () => {
    onEdit(question.id!);
  };

  const handleDelete = () => {
    onDelete(question.id!);
  };

  return (
    <tr key={question.id} className="table-row-hover">
      <td>{index + 1}</td>
      <td>{question.label}</td>
      <td>{typeDisplayName}</td>
      <td>{question.text || '-'}</td>
      <td>
        <QuestionOptionsComponent options={question.options} />
      </td>
      <td>{question.active ? 'Yes' : 'No'}</td>
      <td>{question.required ? 'Yes' : 'No'}</td>
      <td>
        <button className="btn btn-sm btn-outline-primary mx-1 " onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-outline-danger mx-1 " onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

type QuestionOptionsProps = {
  options: Option[] | undefined;
};

export const QuestionOptionsComponent: React.FC<QuestionOptionsProps> = ({ options }) => {
  if (!options || options.length === 0) return <div style={{ textAlign: 'center' }}>-</div>;

  return (
    <ul className="list-group">
      {options.map((option) => (
        <li className="list-group-item" key={option.id}>
          {option.text}
        </li>
      ))}
    </ul>
  );
};
