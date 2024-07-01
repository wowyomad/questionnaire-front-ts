import Option from './Option';

interface Answer {
  id: number;
  questionId: number;
  questionType: string;
  text?: string | null;
  selectedOptions?: Option[] | null;
}

export default Answer;