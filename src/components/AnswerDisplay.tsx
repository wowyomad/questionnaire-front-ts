import React from 'react';
import { Answer } from '../types/Answer';
import { Option } from '../types/Option';

type AnswerDisplayProps = {
  answer?: Answer;
};

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer }) => {
  if (!answer) {
    return <div>-</div>; 
  }

  const { text, selectedOptions } = answer;

  if (text !== undefined && text !== null) {
    return <div>{text}</div>; 
  } else if (selectedOptions && selectedOptions.length > 0) {
    return <QuestionOptionsComponent options={selectedOptions} />; 
  } else {
    return <div>-</div>; 
  }
};

type QuestionOptionsProps = {
  options: Option[] | undefined;
};

const QuestionOptionsComponent: React.FC<QuestionOptionsProps> = ({ options }) => {
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

export default AnswerDisplay;
