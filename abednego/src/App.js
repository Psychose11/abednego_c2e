 // App.js
import React, { useState ,useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/login/login';
import SignUp from './components/login/enregistrement';
import Default from './components/dashboard/default';
import ProjectGestion from './components/projet/projectPannel';
import Dashboard from './components/prospection/pannel';
import Users from './components/users/userView';
import ConfigProjet from './components/projet/createPojetPannel';

import ProtectedRoute from './protectedRoute';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={<SignIn />}
      />
      <Route
        path="/login"
        element={<SignIn />}
      />
      <Route
        path="/enregistrement"
        element={<SignUp />}
      />
      <Route
        path="/default"
        element={
          <ProtectedRoute
            element={<Default />}
            isAuthenticated={isAuthenticated}
            goto="/default"
          />
        }
      />
      <Route
        path="/client-global"
        element={
          <ProtectedRoute
            element={<ProjectGestion />}
            isAuthenticated={isAuthenticated}
            goto="/client-global"
          />
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute
            element={<Users />}
            isAuthenticated={isAuthenticated}
            goto="/users"
          />
        }
      />
      <Route
        path="/projet-config"
        element={
          <ProtectedRoute
            element={<ConfigProjet />}
            isAuthenticated={isAuthenticated}
            goto="/projet-config"
          />
        }
      />
      <Route
        path="/prospection"
        element={
          <ProtectedRoute
            element={<Dashboard />}
            isAuthenticated={isAuthenticated}
            goto="/prospection"
          />
        }
      />
    </Routes>
  );
}

export default App;
