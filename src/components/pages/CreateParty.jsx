import "./SignUp.scss";
import { useState, useEffect } from "react";
import { db } from "../../firebase.js";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const CreateParty = () => {

    const [dataEvent, setDataEvent] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [maxNumberOfParticipans, setMaxNumberOfParticipans] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const navigate = useNavigate();

    const [userUid, setUserUid] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const userUid = JSON.parse(storedUser).uid;
        setUserUid(userUid);
    }, []);

    const addParty = async () => {
        event.preventDefault();
        const partyDocRef = doc(db, "parties", userUid);
        await setDoc(partyDocRef, {
            name: name,
            location: location,
            dateEvent: dataEvent,
            maxNumberOfParticipans: maxNumberOfParticipans,
            maxBudget: maxBudget,
            eventOrganizer: userUid,
        });

        let partyDoc = await getDoc(doc(db, "parties", userUid));
        let partyData = partyDoc.data();
        localStorage.setItem('partyData', JSON.stringify(partyData));

        navigate("/petreceri");
    }

    return (
        <div className="containerSignUp">
            <form className="signUp" >
                <h1 className="title">Creeaza Petrecerea</h1>
                <input type="text" placeholder="Nume petrecere" onChange={e => setName(e.target.value)} />
                <input type="text" placeholder="Locatie petrecere" onChange={e => setLocation(e.target.value)} />
                <input type="date" placeholder="Data Petrecere" onChange={e => setDataEvent(e.target.value)} />
                <input type="number" placeholder="Numar maxim participanti" onChange={e => setMaxNumberOfParticipans(e.target.value)} />
                <input type="number" placeholder="Buget maxim(in lei)" onChange={e => setMaxBudget(e.target.value)} />
                <button onClick={addParty}>Creeaza petrecere</button>
            </form>
        </div>
    );
}