import { useEffect, useState } from "react";
import { api } from "../services/api";
import Question from "../types/Question";
import SubmissionForm from "../components/SubmissionForm";
import { useNavigate } from "react-router-dom";

function SubmissionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter(question => question.active);
    setFilteredQuestions(filtered);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      const data = await api.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const onSubmit = () => {
    sessionStorage.setItem('fromSubmission', 'true');
    navigate('/success');
  } 

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Submission</h2>
      {filteredQuestions.length > 0 && (
        <SubmissionForm questions={filteredQuestions} onSubmissionSuccess={onSubmit}/>
      )}
    </div>
  );
}

export default SubmissionPage;