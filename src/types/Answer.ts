import { Option } from './Option'; 

export type Answer = {
  id: number;
  questionId: number;
  questionType: string;
  text?: string | null;
  selectedOptions?: Option[] | null;
}