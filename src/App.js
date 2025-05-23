import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import { getRefreshToken } from "./actions/Auth.action";
import PrivateOutlet from "./utils/PrivateOutlet";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { LoginPage, DashboardPage } from "./views";
import SignupPage from "./views/SignupPage/SignupPage";
import TilePage from "./views/TilePage/TilePage";
import AddTilePage from "./views/AddTilePage/AddTilePage";


function App({ getRefreshToken }) {
  useEffect(() => {
    if (localStorage.getItem("token_book")) {
      setAuthToken(localStorage.getItem("token_book"));
    }
    getRefreshToken();
  }, [getRefreshToken]);

  return (
    <>
      <ToastContainer newestOnTop theme="dark" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="tile" element={<TilePage />} />
          <Route path="tile/add" element={<AddTilePage />} />
          <Route path="tile/:id/edit" element={<AddTilePage edit />} />


          <Route path="/*" element={<PrivateOutlet />}>
            <>
              
            </>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default connect(null, { getRefreshToken })(App);
