const stripTrailingSlash = (url) => url.replace(/\/$/, '');

export const AUTH_API_URL = stripTrailingSlash(
  process.env.REACT_APP_AUTH_API_URL || 'http://localhost:1000',
);

export const FUTSAL_API_URL = stripTrailingSlash(
  process.env.REACT_APP_FUTSAL_API_URL || 'http://localhost:5000',
);
