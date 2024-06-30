import { Answer } from './Answer'

export type Submission = {
  id: number;
  submissionTime: string;
  answers: Answer[];
}