import React from 'react';
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Protected({ children }) {
    return (
        <>
            <AuthContext.Consumer>
                {({ user, loading }) => {
                    if (loading) {
                        return <div>Loading...</div>;
                    }
                    if (!user) {
                        return <Navigate to="/login" />;
                    }
                    return children;
                }}
            </AuthContext.Consumer>
        </>
    );
}

export default Protected;
