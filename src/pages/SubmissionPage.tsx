import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import Question from "../types/Question";
import Answer from "../types/Answer";
import Submission from "../types/Submission";

const SubmissionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                const submissionId = parseInt(id!, 10);
                const [submissionData, questionsData] = await Promise.all([
                    api.getSubmission(submissionId),
                    api.getQuestions(),
                ]);
                setSubmission(submissionData);
                setQuestions(questionsData);
            } catch (err: Error | any) {
                setError((err as Error).message);
            }
        };

        fetchSubmissionDetails();
    }, [id]);

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    if (!submission) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-sm mt-5">
            <h2>Submission Details</h2>
            <ul className="list-group">
                {questions.map((question) => {
                    const answer: Answer | undefined = submission.answers.find(a => a.questionId === question.id);
                    return (
                        <li key={question.id} className="list-group-item">
                            <strong>{question.label}:</strong> {answer?.text || (answer?.selectedOptions && answer.selectedOptions.map(opt => opt.text).join(', ')) || 'N/A'}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SubmissionPage;
