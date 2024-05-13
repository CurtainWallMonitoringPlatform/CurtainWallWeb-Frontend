// plugins/cleanup.js
export default ({ app }) => {
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('email');
    });
  };
  