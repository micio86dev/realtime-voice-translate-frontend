let online = navigator.onLine;

export const startConnectionStatus = () => {
  window.addEventListener('online', () => {
    online = navigator.onLine;
  });
  window.addEventListener('offline', () => {
    online = navigator.onLine;
  });
}

export const isOnline = () => {
  return online;
}