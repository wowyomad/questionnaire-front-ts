import { useEffect, useState } from "react";
import { api } from "../services/api";
import Question from "../types/Question";
import SubmissionForm from "../components/QuestionnaireForm";
import Pagination from "../components/Pagination"; 
import { useNavigate } from "react-router-dom";

const itemsPerPage = 8;

function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalQuestions();
    fetchQuestions(currentPage, itemsPerPage);
  }, [currentPage]);

  useEffect(() => {
    const filtered = questions.filter(question => question.active);
    setFilteredQuestions(filtered);
  }, [questions]);

  const fetchQuestions = async (offset: number, limit: number) => {
    try {
      const data = await api.getQuestions(offset, limit);
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchTotalQuestions = async () => {
    try {
      const total = await api.getQuestionsCount();
      setTotalQuestions(total);
    } catch (error) {
      console.error('Error fetching total questions:', error);
    }
  };

  const onSubmit = (submissionId: number) => {
    sessionStorage.setItem('fromSubmission', 'true');    
    navigate(`/submission/${submissionId}`);
  };

  return (
    <div className="container-sm mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 shadow-3-strong p-5 mb-5 rounded">
          <h2 className="mb-4">Submission</h2>
          {filteredQuestions.length > 0 && (
            <SubmissionForm questions={filteredQuestions} onSubmissionSuccess={onSubmit} />
          )}
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalQuestions / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default QuestionnairePage;
