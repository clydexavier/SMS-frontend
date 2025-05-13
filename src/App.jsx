// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthProviderWrapper from './auth/AuthProviderWrapper';

function App() {
  return (
    <BrowserRouter>
      <AuthProviderWrapper>
        <AppRoutes />
      </AuthProviderWrapper>
    </BrowserRouter>
  );
}

export default App;
