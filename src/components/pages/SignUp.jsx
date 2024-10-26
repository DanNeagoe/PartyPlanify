import "./SignUp.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("utilizator");
    const [name, setName] = useState("");
    const [maxnumberOfStudents, setMaxNumberOfStudents] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const photo = "https://firebasestorage.googleapis.com/v0/b/partyplanify.appspot.com/o/defaultPhoto.webp?alt=media&token=ac09587e-62e2-4b03-bb44-6ce0cb3ec7cb";
    const navigate = useNavigate();

    const handleSignUp = async e => {
        e.preventDefault();

        if (password !== verifyPassword) {
            setError("Parolele nu corespund.");
            return;
        }

        if (email.length === 0) {
            setError('Adauga adresa de email');
            return;
        }

        if (name.length < 3) {
            setError('Numele de utilizator trebuie să conțină minim 3 caractere.');
            return;
        }
        if (phoneNumber.length !== 10) {
            setError('Numărul de telefon introdus este invalid.');
            return;
        }


        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            try {
                let dataBasecollection = "users";

                const userDocRef = doc(db, dataBasecollection, user.uid);
                await setDoc(userDocRef, {
                    email: user.email,
                    name: name,
                    photo: photo,
                    phoneNumber: phoneNumber,
                    partyId: "",
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            navigate("/");

        } catch (error) {
            console.error("Error during sign up: ", error);
            if (error.code === 'auth/email-already-in-use') {
                setError("Adresa de email este deja utilizată. Te rog să folosești o adresă diferită.");
            } else {
                setError("A apărut o eroare la înregistrare. Te rog să încerci din nou.");
            }
        }
    };

    return (
        <div className="containerSignUp">
            <form className="signUp" onSubmit={handleSignUp}>
                <h1 className="title">Sign up</h1>
                <h2>Este rapid și ușor.</h2>
                <input type="email" placeholder="Adresa de email" onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Nume utilizator" onChange={e => setName(e.target.value)} />
                <input type="text" placeholder="Număr telefon" onChange={e => setPhoneNumber(e.target.value)} />
                <input type="password" id="password" placeholder="Parola" onChange={e => setPassword(e.target.value)} />
                <input type="password" id="verifyPassword" placeholder="Parola" onChange={e => setVerifyPassword(e.target.value)} />
                {error && <span className="errorMessage">{error}</span>}
                <button className="signUpButton" type="submit">Înscrie-te</button>
            </form>
        </div>
    );
}