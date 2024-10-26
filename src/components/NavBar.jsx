import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi"; // Import the menu icon
import "./NavBar.scss";
//import { RatingComponent } from "./RatingComponent.jsx";
export const NavBar = () => {
  const [isOpen, showMenu] = useState(false);
  const [user, setUser] = useState(false);
  let userImage = JSON.parse(localStorage.getItem("userData")).photo;
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setUser(JSON.parse(savedUser))
    setType(localStorage.getItem("type"))
  }, []);



  const handleLogout = () => {
    const confirmDelete = window.confirm(
      "Ești sigur că vrei să părăsești pagina?"
    );
    if (confirmDelete) {
      localStorage.clear();
      navigate("/");
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, document.title, window.location.href);
      });
    }
  }

  const toggleMenu = () => {
    showMenu(!isOpen)
  }

  return (
    <nav className="NavBar">
      <div className="welcomeMessage">PartyPlanify</div>
      <FiMenu className="toggleMenuIcon" onClick={toggleMenu} />
      <ul className={isOpen ? "open" : "closed"}>
        <li>
          <NavLink className="navLink" to={"/utilizator"}>Acasă</NavLink>
        </li>
        <li>
          <NavLink className="navLink" to={"/petreceri"}>Petreceri</NavLink>
        </li>
        <li>
          <NavLink className="navLink" to="/editareProfil">Editare Profil</NavLink>
        </li>
        <li>
          <button className="buttonLeave" onClick={handleLogout}>
            Delogare
          </button>
        </li>
        <div className="profilePicture">
          <img src={userImage} alt="Profile" />
        </div>
      </ul>
    </nav >
  );
};
