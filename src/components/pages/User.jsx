import { useEffect, useState } from "react";
import { NavBar } from "../NavBar.jsx";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import "./User.scss";

export const User = () => {
  const [partyCode, setPartyCode] = useState(""); // State for the input code
  const [partyId, setPartyId] = useState("");
  const [partyData, setPartyData] = useState(""); // State to store party details
  const [errorMessage, setErrorMessage] = useState("");
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    // Retrieve user data and party data from localStorage
    const storedUserData = localStorage.getItem("userData");
    const storedPartyData = localStorage.getItem("partyData");

    // Set partyId from userData if available
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setPartyId(parsedUserData.partyId || ""); // Set partyId from userData
      console.log("PARTYID:", parsedUserData.partyId); // Confirm if partyId is defined in userData
    }

    // Optionally log or use partyData as needed
    if (storedPartyData) {
      const parsedPartyData = JSON.parse(storedPartyData);
      setPartyData(parsedPartyData);
      console.log("Party Data:", parsedPartyData); // Optional: log party data
    }

    // Retrieve user UID from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userUid = JSON.parse(storedUser).uid;
      setUserUid(userUid);
    } else {
      setErrorMessage("Eroare: Utilizatorul nu este autentificat.");
    }
  }, []);

  // Function to handle code search and validation
  const handleSearchParty = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      if (!partyCode) {
        setErrorMessage("Vă rugăm să introduceți un cod valid.");
        return;
      }

      // Fetch the document directly by its ID (assuming partyCode is the document ID)
      const partyDocRef = doc(db, "parties", partyCode);
      const partySnapshot = await getDoc(partyDocRef);

      if (partySnapshot.exists()) {
        // Party with the ID exists
        const partyData = partySnapshot.data();
        setPartyId(partyCode); // Update the component state with the partyId
        setPartyData(partyData); // Update the component state with party details

        // Check if userUid is available
        if (!userUid) {
          setErrorMessage("Eroare: Utilizatorul nu este autentificat.");
          return;
        }

        // Update the user document with the new partyId
        const userDocRef = doc(db, "users", userUid);
        await setDoc(userDocRef, { partyId: partyCode }, { merge: true });

        // Update local storage with the new partyId
        const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
        const updatedUserData = { ...storedUserData, partyId: partyCode };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      } else {
        // Show an error message if the code is invalid
        setErrorMessage("Codul introdus este invalid. Vă rugăm să încercați din nou.");
      }
    } catch (error) {
      console.error("Error searching for party:", error);
      setErrorMessage("A apărut o eroare. Vă rugăm să încercați din nou.");
    }
  };

  // Function to handle leaving the party
  const handleLeaveParty = async () => {
    try {
      if (!userUid) {
        setErrorMessage("Eroare: Utilizatorul nu este autentificat.");
        return;
      }

      // Update Firestore: Remove partyId from the user document
      const userDocRef = doc(db, "users", userUid);
      await updateDoc(userDocRef, { partyId: "" });

      // Clear party data from state and local storage
      const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
      localStorage.setItem("userData", JSON.stringify({ ...storedUserData, partyId: "" }));
      setPartyId("");
      setPartyData(null);
      setPartyCode("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error leaving party:", error);
      setErrorMessage("A apărut o eroare la părăsirea petrecerii.");
    }
  };

  return (
    <div className="studentHomePage">
      <div className="navBarStudentHomePage">
        <NavBar />
      </div>
      <div className="mainContainerStudentHomePage">
        {partyId ? (
          <div className="partyDetailsContainer">
            <h2 className="partyTitle">Detaliile Petrecerii</h2>
            <p className="partyDetail"><strong>Nume:</strong> {partyData.name}</p>
            <p className="partyDetail"><strong>Locație:</strong> {partyData.location}</p>
            <p className="partyDetail"><strong>Data:</strong> {partyData.dateEvent}</p>
            <p className="partyDetail"><strong>Număr maxim de participanți:</strong> {partyData.maxNumberOfParticipans}</p>
            <p className="partyDetail"><strong>Buget maxim:</strong> {partyData.maxBudget} lei</p>
            <button onClick={handleLeaveParty} className="leavePartyButton">Părăsește Petrecerea</button>
          </div>
        ) : (
          <div className="codeInputContainer">
            <form onSubmit={handleSearchParty}>
              <label htmlFor="partyCode" className="inputLabel">Introduceți codul petrecerii:</label>
              <input
                type="text"
                id="partyCode"
                value={partyCode}
                onChange={(e) => setPartyCode(e.target.value)}
                placeholder="Cod petrecere"
                className="inputField"
              />
              <button type="submit" className="searchButton">Caută petrecerea</button>
            </form>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};