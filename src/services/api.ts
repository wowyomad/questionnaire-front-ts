import Answer from '../types/Answer';
import AuthenticationResponse from '../types/AuthenticationResponse';
import Question from '../types/Question';
import Submission from '../types/Submission';
import UserLogin from '../types/UserLogin';
import User from '../types/UserProfile';
import UserSignup from '../types/UserSignup';
import persistentStorage from './PersitentStorage';


const API_BASE_URL: string = 'http://localhost:8080';

export async function getUser(userId: number): Promise<User> {
  console.log('awaiting get user')
  const token = persistentStorage.getToken();
  if (!token) {
    throw new Error('No token')
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error(`Couldn't get user. Status: ${response.status}`);
    }

    const user = await response.json() as User
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }

}

export async function getSubmissionsCount(): Promise<number> {

  try {
    const response = await fetch(`${API_BASE_URL}/submissions/count`)
    if (!response.ok) {
      throw new Error(`Couldn't fetch submissions count. Status: ${response.status}`);
    }
    const count: number = await response.json()
    return count

  } catch(error) {
    console.error('Error fetching submissions count:', error);
    throw error;
  }
}

export async function getQuestionsCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/count`)
    if (!response.ok) {
      throw new Error(`Couldn't fetch questions count. Status: ${response.status}`);
    }
    const count: number = await response.json()
    return count

  } catch(error) {
    console.error('Error fetching questions count:', error);
    throw error;
  }
}

export async function getQuestions(offset?: number, limit?: number): Promise<Question[]> {
  try {
    const url = offset !== undefined && limit !== undefined
     ? `${API_BASE_URL}/questions?offset=${offset}&limit=${limit}`
     : `${API_BASE_URL}/questions`

    const response = await fetch(url, {
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

export async function addQuestion(newQuestion: Question): Promise<Question> {
  const token = persistentStorage.getToken();
  if (!token) {
    throw new Error('No token')
  }
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newQuestion),
    });

    if (!response.ok) {
      throw new Error(`Failed to add question. Status: ${response.status}`);
    }

    const addedQuestion: Question = await response.json();
    console.log('Question added successfully:', addedQuestion);
    return addedQuestion;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

export async function updateQuestion(questionId: number, updatedQuestion: Question): Promise<Question> {
  const token = persistentStorage.getToken();
  if (!token) {
    throw new Error('No token')
  }
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedQuestion),
    });

    if (!response.ok) {
      throw new Error(`Failed to update question. Status: ${response.status}`);
    }

    const updatedQuestionData: Question = await response.json();
    console.log(`Question ${updatedQuestionData.id} updated successfully.`);
    return updatedQuestionData;
  } catch (error) {
    console.error(`Error updating question ${updatedQuestion.id}:`, error);
    throw error;
  }
}

export async function deleteQuestion(questionId: number): Promise<void> {
  const token = persistentStorage.getToken();
  if (!token) {
    throw new Error('No token')
  }
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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



export async function getSubmissions(offset?: number, limit?: number): Promise<Submission[]> {
  const url = offset && limit
  ? `${API_BASE_URL}/submissions?offset=${offset}&limit=${limit}`
  : `${API_BASE_URL}/submissions`
  console.log(url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch submissions. Status: ${response.status}`);
    }
    const data: Submission[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
}

export async function addSubmission(submission: Submission): Promise<Submission> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      throw new Error(`Failed to add submission. Status: ${response.status}`);
    }
    const addedSubmission: Submission = await response.json();
    return addedSubmission;
  } catch (error) {
    console.error('Error adding submission:', error);
    throw error;
  }
}

export async function deleteSubmission(id: number): Promise<void> {
  const token = persistentStorage.getToken();
  if (!token) {
    throw new Error('No token')
  }
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to delete submission ${id}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting submission ${id}:`, error);
    throw error;
  }
}

export async function login(credentials: UserLogin): Promise<AuthenticationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Failed to login. Bad credentials')
      }
      throw new Error(`Failed to login. Status: ${response.status}`)
    }
    const json = await response.json();
    if (!json.token || !json.userId) {
      throw new Error(`Invalid response format`);
    }
    return json as AuthenticationResponse;

  } catch (error) {
    console.error(`Error logging in.`, error)
    throw error;
  }
}

export async function signup(credentials: UserSignup): Promise<AuthenticationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Email is already in use')

      }
      throw new Error(`Failed to sign up. Status: ${response.status}`)
    }
    const json = await response.json();
    if (!json.token || !json.userId) {
      throw new Error(`Invalid response format. Expected ${AuthenticatorResponse}, Received: ${json} `);
    }
    return json as AuthenticationResponse;

  } catch (error) {
    console.error(`Error signing up.`, error)
    throw error;
  }
}

export async function submitAnswers(answers: Answer[]): Promise<void> {
  const submission: Submission = { answers }
  console.log(JSON.stringify(submission))


  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission)
    }
    )
    if(response.status !== 201) {
        throw new Error (`Submission not accepted. Status: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error submitting.`, error)
    throw error;
  }
}



export const api = {
  getUser,
  getQuestions,
  getQuestionsCount,
  getSubmissionsCount,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getSubmissions,
  addSubmission,
  deleteSubmission,
  signup,
  login,
  submitAnswers
};
