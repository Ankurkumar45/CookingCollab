// import React, { createContext, useContext, useState, useEffect } from 'react';

// // const AuthContext = createContext();

// function AuthContext() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             setUser({ token }); // later you can decode user info
//         }
//         setLoading(false);
//     }, []);

//     const login = (token) => {
//         localStorage.setItem("token", token);
//         setUser({ token });
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setUser(null);
//     };

//     return (
//         <>
//             <AuthContext.Provider value={{ user, login, logout, loading }}>
//                 {children}
//             </AuthContext.Provider>
//         </>
//     );
// }

// export default AuthContext;
