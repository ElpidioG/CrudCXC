import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
            setUsername(decodedToken.username); 
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        setUsername(decodedToken.username);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
    };

 if (!role) {
    window.location.href = '/landing'; 
}
    return (
        <AuthContext.Provider value={{ isAuthenticated, role, username, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
};