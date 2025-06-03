import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GeneratorPage from './pages/GeneratorPage';
import PreviewPage from './pages/PreviewPage';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Layout>
  );
}

export default App;