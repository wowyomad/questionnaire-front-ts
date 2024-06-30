import React from 'react';
import { Question } from '../types/Question';
import { Submission } from '../types/Submission';
import { Answer } from '../types/Answer';


const MAX_TABLE_HEADER_LENGTH: number = 40;

type ResponsesTableProps = {
  questions: Question[];
  submissions: Submission[];
  onDelete: (id: number) => void;
};

type TableHeadersProps = {
  questions: Question[]
}

type TableBodyProps = {
  questions: Question[];
  submissions: Submission[];
  onDelete: (id: number) => void;
}

type TableRowProps = {
  questions: Question[];
  submission: Submission;
  index: number;
  onDelete: (id: number) => void;
}

type AnswerCellProps = {
  answer: Answer | undefined
}


const ResponsesTable: React.FC<ResponsesTableProps> = ({
  questions,
  submissions,
  onDelete,
}) => {

  return (
    <div className="table-responsive">
      <table className='table table-hover'>
        <TableHeaders questions={questions} />
        <TableBody questions={questions} submissions={submissions} onDelete={onDelete} />
      </table>
    </div>

  );
}
export default ResponsesTable;



const TableHeaders: React.FC<TableHeadersProps> = ({ questions }) => {
  return (
    <thead>
      <tr>
        <th style={{ minWidth: '6rem' }}></th>
        <th className="text-center" style={{ minWidth: '8rem' }}>#</th>
        <th className="text-center" style={{ minWidth: '12rem' }}>Time</th>
        {questions.map(question => (
          <th key={question.id} className='text-start' style={{ minWidth: '12rem' }}>
            {question.label.length < MAX_TABLE_HEADER_LENGTH
              ? question.label
              : `${question.label.slice(0, MAX_TABLE_HEADER_LENGTH)}...`}
          </th>
        ))}
      </tr>
    </thead>
  );
}

const TableBody: React.FC<TableBodyProps> = ({ questions, submissions, onDelete }) => {
  return (
    <tbody>
      {submissions.map((submission, index) => (
        <TableRow key={submission.id} submission={submission} questions={questions} index={index + 1} onDelete={onDelete}></TableRow>
      ))}
    </tbody>
  )
}


const TableRow: React.FC<TableRowProps> = ({ questions, submission, index, onDelete }) => {
  const handleDelete = () => onDelete(submission.id)
  let answers: Map<number, Answer | undefined> = new Map<number, Answer>();
  questions.forEach(question => {
    let answer: Answer | undefined = submission.answers.find(answer => answer.questionId === question.id)
    answers.set(question.id!, answer)
  })
  return (
    <tr>
      <td>
        <button className='btn btn-outline-danger' onClick={handleDelete}>Delete</button>
      </td>
      <td className='text-center'>{index}</td>
      <td className='text-center'>{submission.submissionTime}</td>
      {questions.map(question => (
        <AnswerCell answer={answers.get(question.id!)}/>
      ))}
    </tr>
  )
}

const AnswerCell: React.FC<AnswerCellProps> = ({ answer }) => {


  if(answer?.text?.length ?? 0 > 0) {
    return (<td className='text-center'>{answer!.text}</td>)
  }

  if(answer?.selectedOptions?.length ?? 0 > 0) {
    let selectedOptions = answer!.selectedOptions!
    selectedOptions.sort((a, b) => a.index! - b.index!)
    return (
      <td >
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.index}>
              {answer!.selectedOptions!.length > 1 ? `${option.index! + 1}. ${option.text}` : option.text}
            </li>
          ))}
        </ul>
      </td>
    );
  }

  return (<td >N/A</td>);
}
