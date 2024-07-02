import React, { useState, useEffect, ChangeEvent, FormEvent, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Question from '../types/Question';
import QuestionType from '../types/QuestionType';


type QuestionModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (question: Question) => void;
    isEditMode?: boolean;
    question?: Question;
};

const QuestionModal: React.FC<QuestionModalProps> = ({ show, onClose, onSubmit, isEditMode = false, question }) => {
    const initialQuestionState: Question = useMemo(() => ({
        id: undefined,
        label: '',
        text: '',
        type: QuestionType.SINGLE_LINE_TEXT,
        options: [],
        active: true,
        required: false,
    }), []);

    const [formData, setFormData] = useState<Question>(initialQuestionState);
    const [labelError, setLabelError] = useState<string>('');
    const [optionsError, setOptionsError] = useState<string>('');

    useEffect(() => {
        if (isEditMode && question) {
            setFormData({ ...question });
        } else {
            setFormData(initialQuestionState);
        }
    }, [isEditMode, question, initialQuestionState]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue,
        }));

        if (name === 'label') {
            setLabelError('');
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...formData.options!];
        updatedOptions[index] = { ...updatedOptions[index], text: value };
        setFormData(prevState => ({
            ...prevState,
            options: updatedOptions,
        }));

        setOptionsError('');
    };

    const addOption = () => {
        const updatedOptions = [...formData.options!, { text: '' }];
        setFormData(prevState => ({
            ...prevState,
            options: updatedOptions,
        }));

        setOptionsError('');
    };

    const removeOption = (index: number) => {
        const updatedOptions = formData.options!.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            options: updatedOptions,
        }));

        setOptionsError('');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (formData.label.trim() === '') {
            setLabelError('Label is required');
            return;
        } else {
            setLabelError('');
        }

        if ((formData.type === QuestionType.RADIO_BUTTON || formData.type === QuestionType.COMBOBOX) && formData.options!.length < 2) {
            setOptionsError(`For ${formData.type === QuestionType.RADIO_BUTTON ? 'Radio Button' : 'Combobox'}, at least 2 options are required.`);
            return;
        }

        if ((formData.type === QuestionType.RADIO_BUTTON || formData.type === QuestionType.CHECKBOX || formData.type === QuestionType.COMBOBOX) &&
            formData.options!.some(option => option.text?.trim() === '')
        ) {
            setOptionsError('Options cannot be blank.');
            return;
        }

        setOptionsError('');

        formData.options?.forEach((option, index) => {
            option.index = index;
        })

        onSubmit(formData);
        setFormData(initialQuestionState)
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Question' : 'Add Question'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

                    <Form.Group controlId="label" className="mb-4">
                        <Form.Label>Label</Form.Label>
                        <Form.Control type="text" name="label" value={formData.label} onChange={handleInputChange} />
                        {labelError && <Form.Text className="text-danger">{labelError}</Form.Text>}
                    </Form.Group>

                    <Form.Group controlId="type" className="mb-4">
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select" name="type" value={formData.type} onChange={handleInputChange}>
                            <option value={QuestionType.SINGLE_LINE_TEXT}>Single Line Text</option>
                            <option value={QuestionType.MULTILINE_TEXT}>Multiline Text</option>
                            <option value={QuestionType.RADIO_BUTTON}>Radio Button</option>
                            <option value={QuestionType.CHECKBOX}>Checkbox</option>
                            <option value={QuestionType.COMBOBOX}>Combobox</option>
                            <option value={QuestionType.DATE}>Date</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="text" className="mb-4">
                        <Form.Label>{formData.type === QuestionType.DATE ? 'Date' : 'Text'}</Form.Label>
                        <Form.Control as="textarea" name="text" value={formData.text} onChange={handleInputChange} />
                    </Form.Group>


                    {(formData.type === QuestionType.RADIO_BUTTON || formData.type === QuestionType.CHECKBOX || formData.type === QuestionType.COMBOBOX) && (
                        <Form.Group controlId="options" className="mb-4">
                            <Form.Label>Options</Form.Label>
                            {formData.options?.map((option, index) => (
                                <div key={index} className="mb-3 d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="mr-2"
                                    />
                                    <Button variant="outline-danger" size="sm" onClick={() => removeOption(index)}>Remove</Button>
                                </div>
                            ))}
                            <div>
                                <Button variant="primary" size="sm" onClick={addOption}>Add Option</Button>
                            </div>
                            {optionsError && (
                                <div className="mt-2 text-danger">
                                    {optionsError}
                                </div>
                            )}
                        </Form.Group>
                    )}

                    <Form.Group controlId="active" className="mb-4">
                        <Form.Check type="checkbox" name="active" label="Active" checked={formData.active} onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="required" className="mb-4">
                        <Form.Check type="checkbox" name="required" label="Required" checked={formData.required} onChange={handleInputChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {isEditMode ? 'Save Changes' : 'Add'}
                    </Button>

                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default QuestionModal;
