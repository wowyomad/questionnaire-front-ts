import Answer from './Answer'

interface Submission {
  id?: number;
  submissionTime?: string;
  answers: Answer[];
}

export default Submission;