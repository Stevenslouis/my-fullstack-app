
const API_URL = import.meta.env.VITE_API_URL;


const isLoggedIn = async () => {
  const response = await fetch(`${API_URL}/api/auth/check`, {
    method: 'GET',
    headers: {
    },
    credentials: 'include',
  });
  return response.json();
};

const fetchQuizzes = async () => {

  const response = await fetch(`${API_URL}/api/quizzes/get`, {
    method: 'GET',
    headers: {

    },
    credentials: 'include',
  });
  return response.json();
};

const createQuiz = async (quiz) => {
  const response = await fetch(`${API_URL}/api/quizzes/add`, {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer` // Attach token
    },
    credentials: 'include',

    body: JSON.stringify(quiz)
  }
  );

  if (response.status === 500) {
    throw new Error('Unable to Save Quiz')
  }

  return response.json();
}


const loginUser = async (loginInfo) => {

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(loginInfo)
  })

  return response.json()
}

const registerUser = async (loginInfo) => {

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(loginInfo)

  })

  return response.json()
}

const deleteQuiz = async (quizId) => {

  const response = await fetch(`${API_URL}/api/quizzes/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ _id: quizId })

  })

  return response.json()
}


const logOutUser = async () => {

  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  return response.json()
};

const sendPasswordResetLink = async (email) => {

  const response = await fetch(`${API_URL}/api/auth/send-reset-link`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email
    })

  });

  return response.json()
};

const changePassword = async (token, password) => {

  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _token: token,
      _password: password
    })

  });

  return response.json()
};

const resetTokenValidator = async (token) => {

  const response = await fetch(`${API_URL}/api/auth/check-password-reset-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: token
    })

  });

  return response.json()
};

const updateQuiz = async (data) => {

  const response = await fetch(`${API_URL}/api/quizzes/update`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

  });

  return response.json()
};

const uploadQuiz = async (data) => {

  const response = await fetch(`${API_URL}/api/quizzes/upload`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

  });

  return response.json()
};
const fetchQuizHistory = async (quizId) => {

  const response = await fetch(`${API_URL}/api/quizzes/history`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: quizId })
  });

  return response.json()
};



export { fetchQuizzes, fetchQuizHistory, createQuiz, loginUser, registerUser, isLoggedIn, deleteQuiz, logOutUser, sendPasswordResetLink, changePassword, resetTokenValidator, updateQuiz, uploadQuiz }


