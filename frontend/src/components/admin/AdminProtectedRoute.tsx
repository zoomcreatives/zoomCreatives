import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthGlobally } from '../../context/AuthContext';

const AdminProtectedRoute = () => {
    const [ok, setOk] = useState(false);
    const [auth] = useAuthGlobally();
    const navigate = useNavigate();

    useEffect(() => {
        const authCheck = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/auth/admin`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.token}`,
                        },
                    }
                );
                console.log('Admin check response:', response.data);
                setOk(response.data.ok);
            } catch (error:any) {
                console.error('Error checking authentication:', error.response?.data || error.message);
                setOk(false);
            }
        };
        

        if (auth?.token) {
            authCheck();
        } else {
            setOk(false);
        }
    }, [auth?.token]);

    useEffect(() => {
        if (!ok) {
            navigate('/');
        }
    }, [ok, navigate]);

    return ok ? <Outlet /> : null;
};

export default AdminProtectedRoute;
