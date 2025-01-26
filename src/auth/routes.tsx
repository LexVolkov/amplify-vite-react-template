import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PublicPage from '../pages/public/PublicPage';
import AdminPage from '../pages/admin/AdminPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ControlPage from '../pages/control/ControlPage';
import ProtectedRoute from './ProtectedRoute';
import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные страницы */}

                    <Route path="/" element={
                        <ProtectedRoute groups={['GODS', 'CURATORS', 'KIDS', 'GUEST', 'NO GROUP']}>
                            <PublicPage/>
                        </ProtectedRoute>
                    }/>

                {/* Защищённые страницы */}
                <Route
                    path="/profile"
                    element={
                        <Authenticator>
                            <ProtectedRoute groups={['GODS', 'CURATORS', 'KIDS', 'NO GROUP']}>
                                <ProfilePage/>
                            </ProtectedRoute>
                        </Authenticator>
                    }
                />
                <Route
                    path="/control"
                    element={
                        <Authenticator>
                            <ProtectedRoute groups={['GODS', 'CURATORS']}>
                                <ControlPage/>
                            </ProtectedRoute>
                        </Authenticator>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <Authenticator>
                            <ProtectedRoute groups={['GODS']}>
                                <AdminPage/>
                            </ProtectedRoute>
                        </Authenticator>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
