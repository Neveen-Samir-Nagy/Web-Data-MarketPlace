
import LOGIN from "./components/login";
import Products from "./components/products";
import New from "./components/new";
import UserRequests from "./components/UserRequests";
import Guest from "./components/Guest"
import Cart from "./components/Cart"

import Admin from "./components/admin"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
function App() {
  //window.onbeforeunload = function() {
  //localStorage.clear();
  //}
  return (
    <BrowserRouter> 
    <main>
       <Routes>
          <Route path="/" element={<LOGIN/> }/>
          </Routes>
          {secureLocalStorage.getItem("admin") === 'yes'?
           <Routes>
            <Route path="/admin" element={<Admin />} />
          </Routes>:(
           secureLocalStorage.getItem("Guest") === 'yes'?
            <Routes>
                             <Route path="/home" element={<Guest />} /> 
            </Routes>
               :
               <Routes><Route path="/products" element={<Products />} />
               <Route path="/new" element={<New />} /> 
               <Route path="/cart" element={<Cart />} /> 

               <Route path="/requests" element={<UserRequests />} /></Routes>)}
               </main>
                </BrowserRouter>
  );
}

export default App;
