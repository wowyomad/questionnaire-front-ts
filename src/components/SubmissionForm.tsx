import React, { useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Question from '../types/Question';
import Option from '../types/Option';
import Answer from '../types/Answer';
import { api } from '../services/api';
import QuestionType from '../types/QuestionType';

interface SubmissionFormProps {
    questions: Question[];
    onSubmissionSuccess?: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ questions, onSubmissionSuccess }) => {
    const [formData, setFormData] = useState<{ [key: number]: Answer }>({});

    const handleInputChange = (questionId: number, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: {
                ...prevData[questionId],
                questionId,
                questionType: QuestionType.SINGLE_LINE_TEXT,
                text: value,
            },
        }));
    };

    const handleSingleOptionChange = (questionId: number, option: Option) => {
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: {
                ...prevData[questionId],
                questionId,
                questionType: QuestionType.RADIO_BUTTON,
                selectedOptions: [option],
            },
        }));
    };

    const handleCheckboxChange = (questionId: number, option: Option) => {
        setFormData((prevData) => {
            const currentOptions = prevData[questionId]?.selectedOptions || [];
            const updatedOptions = currentOptions.some((opt) => opt.id === option.id)
                ? currentOptions.filter((opt) => opt.id !== option.id)
                : [...currentOptions, option];

            return {
                ...prevData,
                [questionId]: {
                    ...prevData[questionId],
                    questionId,
                    questionType: QuestionType.CHECKBOX,
                    selectedOptions: updatedOptions,
                },
            };
        });
    };

    const handleDateChange = (date: Date | null, questionId: number) => {
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: {
                ...prevData[questionId],
                questionId,
                questionType: QuestionType.DATE,
                text: date ? moment(date).format('DD-MM-yyyy') : '',
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please answer all required questions.');
            return;
        }

        try {
            const filteredQuestions = questions.filter((question) => {
                const answer = formData[question.id!];
                return typeof answer?.text === 'string' || (Array.isArray(answer?.selectedOptions) && answer?.selectedOptions.length > 0);
            });

            const submissionData = {
                answers: filteredQuestions.map((question) => ({
                    questionId: question.id!,
                    questionType: question.type,
                    text: formData[question.id!]?.text || null,
                    selectedOptions: formData[question.id!]?.selectedOptions || null,
                })),
            };

            await api.submitAnswers(submissionData.answers);

            onSubmissionSuccess?.()

        } catch (error) {
            console.error("Error submitting form:", error);
            alert('Failed to submit answers');
        }
    };

    const validateForm = (): boolean => {
        for (const question of questions) {
            if (question.required) {
                const answer = formData[question.id!];
                if (!answer) return false;
                switch (question.type) {
                    case QuestionType.SINGLE_LINE_TEXT:
                    case QuestionType.MULTILINE_TEXT:
                        if (!answer.text || answer.text.trim() === '') return false;
                        break;
                    case QuestionType.RADIO_BUTTON:
                    case QuestionType.COMBOBOX:
                        if (!answer.selectedOptions || answer.selectedOptions.length !== 1) return false;
                        break;
                    case QuestionType.CHECKBOX:
                        if (!answer.selectedOptions || answer.selectedOptions.length === 0) return false;
                        break;
                    case QuestionType.DATE:
                        if (!answer.text || answer.text.trim() === '') return false;
                        break;
                    default:
                        break;
                }
            }
        }
        return true;
    };

    return (
        <form onSubmit={handleSubmit}>
            {questions.map((question) => (
                <div key={question.id} className="mb-3">
                    <label htmlFor={`question-${question.id}`} className="d-block">
                        <div className="d-flex align-items-center">
                            {question.required && (
                                <span className="h1 fw-bold text-danger me-1">!</span>
                            )}
                            <div>
                                <span className="fw-bold">{question.label}</span>
                                {question.text && (
                                    <div className="ms-2">{question.text}</div>
                                )}
                            </div>
                        </div>
                    </label>
                    {question.type === QuestionType.SINGLE_LINE_TEXT && (
                        <input
                            type="text"
                            id={`question-${question.id}`}
                            value={formData[question.id!]?.text || ''}
                            onChange={(e) => handleInputChange(question.id!, e.target.value)}
                            className="form-control"
                        />
                    )}
                    {question.type === QuestionType.MULTILINE_TEXT && (
                        <textarea
                            id={`question-${question.id}`}
                            value={formData[question.id!]?.text || ''}
                            onChange={(e) => handleInputChange(question.id!, e.target.value)}
                            className="form-control"
                            rows={3}
                        />
                    )}
                    {question.type === QuestionType.RADIO_BUTTON && (
                        <div>
                            {question.options?.map((option) => (
                                <div key={option.id} className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        id={`question-${question.id}-${option.id}`}
                                        value={option.id}
                                        checked={formData[question.id!]?.selectedOptions?.[0]?.id === option.id}
                                        onChange={() => handleSingleOptionChange(question.id!, option)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`question-${question.id}-${option.id}`} className="form-check-label">
                                        {option.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === QuestionType.CHECKBOX && (
                        <div>
                            {question.options?.map((option) => (
                                <div key={option.id} className="form-check form-check-inline">
                                    <input
                                        type="checkbox"
                                        id={`question-${question.id}-${option.id}`}
                                        checked={formData[question.id!]?.selectedOptions?.some((opt) => opt.id === option.id)}
                                        onChange={() => handleCheckboxChange(question.id!, option)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`question-${question.id}-${option.id}`} className="form-check-label">
                                        {option.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === QuestionType.COMBOBOX && (
                        <select
                            id={`question-${question.id}`}
                            value={formData[question.id!]?.selectedOptions?.[0]?.id || ''}
                            onChange={(e) => handleSingleOptionChange(question.id!, { id: parseInt(e.target.value, 10) })}
                            className="form-select"
                        >
                            <option value="">Select an option</option>
                            {question.options?.map((option) => (
                                <option key={option.id} value={option.id}>{option.text}</option>
                            ))}
                        </select>
                    )}
                    {question.type === QuestionType.DATE && (
                        <DatePicker
                            id={`question-${question.id}`}
                            selected={formData[question.id!]?.text ? moment(formData[question.id!]?.text, 'DD-MM-yyyy').toDate() : null}
                            onChange={(date) => handleDateChange(date as Date, question.id!)}
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                        />
                    )}
                </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit Response</button>
        </form>
    );
};

export default SubmissionForm;
