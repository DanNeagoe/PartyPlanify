import "./Login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.js";
import { getDoc, doc, collection, getDocs, query, where, updateDoc, arrayRemove } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);
        localStorage.clear();

        try {
            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Save user credentials to local storage
            localStorage.setItem('user', JSON.stringify(userCredential.user));

            // Fetch user data from Firestore
            const userAccountDoc = await getDoc(doc(db, "users", uid));
            let userData;
            if (userAccountDoc.exists()) {
                userData = userAccountDoc.data();
                console.log("User data retrieved from Firestore:", userData); // Log user data to verify contents

                // Check if userData has partyId
                if (userData.partyId) {
                    console.log("Party ID found:", userData.partyId);

                    // Save user data to local storage
                    localStorage.setItem('userData', JSON.stringify(userData));

                    // Fetch party data using the partyId
                    const partyAccountDoc = await getDoc(doc(db, "parties", userData.partyId));
                    if (partyAccountDoc.exists()) {
                        const partyData = partyAccountDoc.data();
                        console.log("Party data retrieved:", partyData); // Log party data to verify contents
                        localStorage.setItem('partyData', JSON.stringify(partyData)); // Save party data to local storage
                    } else {
                        console.log("No party data found with the provided party ID.");
                    }
                } else {
                    console.log("No partyId associated with this user."); // Log if partyId is missing
                }
            } else {
                console.log("No user data found in Firestore.");
            }

            // Navigate to the user page
            navigate("/utilizator");
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle errors (e.g., show an error message to the user)
        }
    }
    const handleCreateAccount = () => {
        navigate("/inregistrare");
    }

    return (
        <div className="loginContainer">
            <form className="login" onSubmit={handleLogin}>
                <h1 className="name">PartyPlanify</h1>
                <input type="email" id="emailAdress" placeholder="Adresa de email" onChange={e => setEmail(e.target.value)} />
                <input type="password" id="password" placeholder="Parola" onChange={e => setPassword(e.target.value)} />
                {error && <span className="errorMessageLogin">{error}</span>}
                <button className="loginButton" type="submit">Conectează-te</button>
                <button className="newUserButton" type="button" onClick={handleCreateAccount}>Crează-ți un cont</button>
                <Link className="resetPasswordLink" to="/resetareParola">Ai uitat parola?</Link>
            </form>
        </div>
    );
}
