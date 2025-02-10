import {Routes, Route} from 'react-router-dom';
import PublicPage from '../pages/public/PublicPage';
import AdminPage from '../pages/admin/AdminPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ControlPage from '../pages/control/ControlPage';
import ProtectedRoute from './ProtectedRoute';
import '@aws-amplify/ui-react/styles.css';
import LoginPage from "./LoginPage.tsx";

export default function Router() {
    return (
        <Routes>
            {/* Публичные страницы */}

            <Route path="/" element={
                <ProtectedRoute groups={['GODS', 'CURATORS', 'KIDS', 'GUEST', 'NO GROUP']}>
                    <PublicPage/>
                </ProtectedRoute>
            }/>
            <Route path="/login" element={
                <LoginPage/>
            }/>

            {/* Защищённые страницы */}
            <Route
                path="/profile"
                element={
                        <ProtectedRoute groups={['GODS', 'CURATORS', 'KIDS', 'NO GROUP']}>
                            <ProfilePage/>
                        </ProtectedRoute>
                }
            />
            <Route
                path="/control"
                element={

                    <ProtectedRoute groups={['GODS', 'CURATORS']}>
                            <ControlPage/>
                    </ProtectedRoute>

                }
            />
            <Route
                path="/admin"
                element={

                    <ProtectedRoute groups={['GODS']}>
                            <AdminPage/>
                    </ProtectedRoute>

                }
            />
        </Routes>
    );
}
