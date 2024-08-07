import React, { useState } from 'react';
import Question from '../types/Question';
import Submission from '../types/Submission';
import Answer from '../types/Answer';
import Pagination from './Pagination';

const MAX_TABLE_HEADER_LENGTH: number = 40;

type ResponsesTableProps = {
  questions: Question[];
  submissions: Submission[];
  onDelete: (id: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

type TableHeadersProps = {
  questions: Question[];
};

type TableBodyProps = {
  questions: Question[];
  submissions: Submission[];
  currentPage: number,
  itemsPerPage: number,
  onDelete: (id: number) => void;
};

type TableRowProps = {
  questions: Question[];
  submission: Submission;
  index: number;
  onDelete: (id: number) => void;
};

type AnswerCellProps = {
  answer: Answer | undefined;
};

const ResponsesTable: React.FC<ResponsesTableProps> = ({
  questions,
  submissions,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <TableHeaders questions={questions} />
          <TableBody questions={questions} submissions={submissions} currentPage={currentPage} itemsPerPage={itemsPerPage} onDelete={onDelete} />
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ResponsesTable;

const TableHeaders: React.FC<TableHeadersProps> = ({ questions }) => {
  return (
    <thead>
      <tr>
        <th style={{ minWidth: '6rem' }}></th>
        <th className="text-center" style={{ minWidth: '8rem' }}>#</th>
        <th className="text-center" style={{ minWidth: '12rem' }}>Time</th>
        {questions.map(question => (
          <th key={question.id} className="text-start" style={{ minWidth: '12rem' }}>
            {question.label.length < MAX_TABLE_HEADER_LENGTH
              ? question.label
              : `${question.label.slice(0, MAX_TABLE_HEADER_LENGTH)}...`}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ questions, submissions, currentPage, itemsPerPage, onDelete }) => {
  return (
    <tbody>
      {submissions.length === 0 && (
        <tr>
          <td colSpan={questions.length + 3} className="text-center">No submissions</td>
        </tr>
      )}
      {submissions.map((submission, index) => (
        <TableRow key={submission.id} submission={submission} questions={questions} index={currentPage * itemsPerPage + index + 1} onDelete={onDelete} />
      ))}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ questions, submission, index, onDelete }) => {
  const handleDelete = () => onDelete(submission.id!);
  let answers: Map<number, Answer | undefined> = new Map<number, Answer>();
  questions.forEach(question => {
    let answer: Answer | undefined = submission.answers.find(answer => answer.questionId === question.id);
    answers.set(question.id!, answer);
  });
  return (
    <tr>
      <td>
        <button className="btn btn-outline-danger" onClick={handleDelete}>Delete</button>
      </td>
      <td className="text-center">{index}</td>
      <td className="text-center">{submission.submissionTime}</td>
      {questions.map(question => (
        <AnswerCell key={question.id} answer={answers.get(question.id!)} />
      ))}
    </tr>
  );
};

const AnswerCell: React.FC<AnswerCellProps> = ({ answer }) => {
  if (answer?.text?.length ?? 0 > 0) {
    return (<td className="text-center">{answer!.text}</td>);
  }
  if (answer?.selectedOptions?.length ?? 0 > 0) {
    let selectedOptions = answer!.selectedOptions!;
    selectedOptions.sort((a, b) => a.index! - b.index!);
    return (
      <td>
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.id}>
              {answer?.questionType === 'CHECKBOX' ? `${option.index! + 1}. ${option.text}` : option.text}
            </li>
          ))}
        </ul>
      </td>
    );
  }
  return (<td>N/A</td>);
};
