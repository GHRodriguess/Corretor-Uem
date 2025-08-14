import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

/* COMPONENTES DE PÁGINA */
import Navbar from '../components/Navbar';

/* Páginas */
import HomePage from '../pages/HomePage';
import VestibularesPage from '../pages/VestibularesPage';
import PasYearSelectionPage from '../pages/PasYearSelectionPage';
import PasSerieSelectionPage from '../pages/PasSerieSelectionPage';
import LanguageSelectionPage from '../pages/LanguageSelectionPage';
import CorrectorPage from '../pages/CorrectorPage';

function App() {
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-900">
                <Navbar />
                

                {/* Container para o conteúdo da página */}
                <main className="flex-grow bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/vestibulares" element={<VestibularesPage />} />                        
                        <Route path="/pas" element={<PasYearSelectionPage />} />
                        <Route path="/pas/:pasYear/serie" element={<PasSerieSelectionPage />} />                        
                        <Route path="/selecionar-idioma/:vestibularName" element={<LanguageSelectionPage />} />
                        <Route path="/corretor/:vestibularName/:languageName" element={<CorrectorPage />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    )
}

export default App;
