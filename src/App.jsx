import { Routes, Route } from "react-router-dom";
import { Login } from "./components/pages/Login.jsx"
import { SignUp } from "./components/pages/SignUp.jsx";
import { ResetPassword } from "./components/pages/ResetPassword.jsx"
import { PrivateRoutes } from "./context/PrivateRoutes.jsx";
import { User } from "./components/pages/User.jsx"
import { Parties } from "./components/pages/Parties.jsx"
import { EditProfile } from "./components/pages/EditProfile.jsx"
import { CreateParty } from "./components/pages/CreateParty.jsx"
function App() {
  return (

    <div className='container'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inregistrare" element={<SignUp />} />
        <Route path="/resetareParola" element={< ResetPassword />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/utilizator" element={<User />} />
          <Route path="/editareProfil" element={<EditProfile />} />
          <Route path="/petreceri" element={<Parties />} />
          <Route path="/creeazaPetrecere" element={<CreateParty />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
