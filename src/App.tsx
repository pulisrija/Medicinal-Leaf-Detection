import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { IdentifyPage } from './pages/IdentifyPage';
import { MedicinalPlantsPage } from './pages/MedicinalPlantsPage';
import { PlantDetailPage } from './pages/PlantDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { MyGardenPage } from './pages/MyGardenPage';
import { AuthProvider } from './context/AuthContext';
import { ApiService } from './services/api';
import { PLANTS_DATA } from './data/plantsData';
import { Plant } from './types';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Poll / check backend connection on mount
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const { online } = await ApiService.checkBackendHealth();
      if (isMounted) {
        setIsBackendConnected(online);
      }
    };
    verifyHealth();

    const interval = setInterval(verifyHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSelectPlantByName = (plantName: string) => {
    const found = PLANTS_DATA.find(
      p => p.name.toLowerCase() === plantName.toLowerCase() || p.id === plantName.toLowerCase()
    );
    if (found) {
      setSelectedPlant(found);
      setActiveTab('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleIdentifyWithPlant = (plantName: string) => {
    setActiveTab('identify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      
      {/* Top Bar Contract (Navbar) */}
      <Navbar
        activeTab={activeTab === 'detail' ? 'plants' : activeTab}
        setActiveTab={(tab) => {
          setSelectedPlant(null);
          setActiveTab(tab);
        }}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              setSelectedPlant(null);
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectPlant={handleSelectPlantByName}
          />
        )}

        {activeTab === 'identify' && (
          <IdentifyPage
            onSelectPlant={handleSelectPlantByName}
            isBackendConnected={isBackendConnected}
          />
        )}

        {activeTab === 'plants' && (
          <MedicinalPlantsPage
            onSelectPlant={handleSelectPlantByName}
          />
        )}

        {activeTab === 'garden' && (
          <MyGardenPage
            onSelectPlant={handleSelectPlantByName}
            onNavigateToIdentify={() => {
              setActiveTab('identify');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'detail' && selectedPlant && (
          <PlantDetailPage
            plant={selectedPlant}
            onBack={() => {
              setSelectedPlant(null);
              setActiveTab('plants');
            }}
            onIdentify={handleIdentifyWithPlant}
          />
        )}

        {activeTab === 'architecture' && (
          <HowItWorksPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Academic & Medical Disclaimer Footer */}
      <Footer
        onNavigate={(tab) => {
          setSelectedPlant(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

