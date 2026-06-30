export const getSessionId = (): string | null => {
  return localStorage.getItem('sessionId');
};

export const setSessionId = (id: string): void => {
  localStorage.setItem('sessionId', id);
};
