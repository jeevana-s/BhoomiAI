import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DigitalTwin from './pages/DigitalTwin';

import Placeholder from './pages/Placeholder';
import CropHealth from './pages/CropHealth';
import { TrendingUp, Droplets, Leaf, Settings } from 'lucide-react';

import MarketPage from './pages/MarketPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />

          <Route
            path="/market"
            element={<MarketPage />}
          />



          <Route
            path="/health"
            element={<CropHealth />}
          />

          <Route
            path="/settings"
            element={
              <Placeholder
                title="Settings"
                icon={Settings}
                description="Manage your farm profile, notifications, and app preferences."
              />
            }
          />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
