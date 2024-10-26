import { useEffect, useState } from "react";
import { NavBar } from "../NavBar.jsx";
import { db } from "../../firebase.js";
import "./Parties.scss";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export const Parties = () => {
  const [partyData, setPartyData] = useState(null); // Stores fetched party data
  const [userUid, setUserUid] = useState("");
  const navigate = useNavigate();

  // Function to fetch party data if the user is the organizer
  const fetchPartyData = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserUid(parsedUser.uid);

      try {
        const partyDocRef = doc(db, "parties", parsedUser.uid); // Assuming the document ID matches the user UID
        const partySnapshot = await getDoc(partyDocRef);

        if (partySnapshot.exists()) {
          const fetchedPartyData = partySnapshot.data();
          setPartyData(fetchedPartyData);
        } else {
          setPartyData(null); // No party found for this user
        }
      } catch (error) {
        console.error("Error fetching party data:", error);
      }
    }
  };

  useEffect(() => {
    fetchPartyData();
  }, []);

  // Handle party deletion
  const handleDeleteParty = async () => {
    if (partyData) {
      try {
        const partyDocRef = doc(db, "parties", userUid);
        await deleteDoc(partyDocRef);

        // Clear local state and localStorage
        localStorage.removeItem("partyData");
        setPartyData(null);

        console.log("Party deleted successfully.");
      } catch (error) {
        console.error("Error deleting party:", error);
      }
    }
  };

  // Navigate to the Create Party page
  const handleAddParty = () => {
    navigate("/creeazaPetrecere");
  };

  return (
    <div className="coachContainer">
      <div className="navBarCoach">
        <NavBar style={{ height: '70px' }} />
      </div>
      <div className="upContainer">
        <div className="secondUpContainer"></div>
        <div className="secondDownContainer">
          <div className="gyms">
            {partyData && partyData.eventOrganizer === userUid ? (
              // Display party details if the user is the organizer
              <div>
                <div>Party Name: {partyData.name}</div>
                <div>Location: {partyData.location}</div>
                <div>Date: {partyData.dateEvent}</div>
                <div>Party Code: {userUid}</div>
                <button onClick={handleDeleteParty} className="deletePartyButton">Delete Party</button>
              </div>
            ) : (
              // Display the "Create Party" button if no party exists
              <div>
                <p className="noGyms">Creeaza o petrecere&nbsp;&nbsp;</p>
                <button className="addGymButton" onClick={handleAddParty}>➕</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
