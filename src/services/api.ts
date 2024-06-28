import { Question } from '../types/Question';

const API_BASE_URL: string = 'http://localhost:8080';

export async function getQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Couldn't fetch questions. Status: ${response.status}`);
    }

    const data: Question[] = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function addQuestion(newQuestion: Question): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuestion),
    });

    if (!response.ok) {
      throw new Error(`Failed to add question. Status: ${response.status}`);
    }

    console.log('Question added successfully.');
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

export async function updateQuestion(questionId: number, updatedQuestion: Question): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedQuestion),
    });

    if (!response.ok) {
      throw new Error(`Failed to update question. Status: ${response.status}`);
    }

    console.log(`Question ${updatedQuestion.id} updated successfully.`);
  } catch (error) {
    console.error(`Error updating question ${updatedQuestion.id}:`, error);
    throw error;
  }
}

export async function deleteQuestion(questionId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete question ${questionId}. Status: ${response.status}`);
    }

    console.log(`Question ${questionId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting question ${questionId}:`, error);
    throw error;
  }
}

export const api = {
    getQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };