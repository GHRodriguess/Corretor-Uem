import { HashRouter, Routes, Route, Navigate  } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

import Navbar from '../components/Navbar';

import HomePage from '../pages/HomePage';
import LoginPage from "../pages/LoginPage";
import VestibularesPasPage from "../pages/VestibularesPasPage"
import VestibularesPage from '../pages/VestibularesPage';
import PasYearSelectionPage from '../pages/PasYearSelectionPage';
import PasSerieSelectionPage from '../pages/PasSerieSelectionPage';
import LanguageSelectionPage from '../pages/LanguageSelectionPage';
import CorrectorPage from '../pages/CorrectorPage';
import AddVestibularPage from '../pages/AddVestibularPage';
import ViewVestibularesPage from '../pages/ViewVestibularesPage';

function App() {
    const { isAuthenticated } = useAuth();
    
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-900">
                <Navbar />
                
                <main className="flex-grow h-full bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-3 flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/" element={<HomePage />} />                         
                        <Route path="/login" element={<LoginPage />} />
                        <Route path='/vestibulares-pas' element={< VestibularesPasPage />} />   
                        <Route path="/vestibulares" element={< VestibularesPage />} />                     
                        <Route path="/pas" element={< PasYearSelectionPage />} />
                        <Route path="/pas/:pasYear/serie" element={<PasSerieSelectionPage />} />                        
                        <Route path="/selecionar-idioma/:vestibularId/:serieId" element={<LanguageSelectionPage />} />
                        <Route path="/selecionar-idioma/:vestibularId/" element={<LanguageSelectionPage />} />
                        <Route path="/corretor/:vestibularId/:languageName/:serieId" element={<CorrectorPage />} />
                        <Route path="/corretor/:vestibularId/:languageName" element={<CorrectorPage />} />
                        <Route path="/add-vestibulares" element={isAuthenticated ? <AddVestibularPage /> : <Navigate to="/login" />}/>
                        <Route path="/view-vestibulares" element={isAuthenticated ? <ViewVestibularesPage /> : <Navigate to="/login" />} />
                        
                    </Routes>
                </main>
            </div>
        </HashRouter>
    )
}

export default App;
