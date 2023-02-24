import LOGIN from "./components/login";
import Products from "./components/products";
import New from "./components/new";
import Cart from "./components/cart";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  //window.onbeforeunload = function() {
  //localStorage.clear();
  //}
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<LOGIN/> }/>
          <Route path="/products" element={<Products />} />
          <Route path="/new" element={<New />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
