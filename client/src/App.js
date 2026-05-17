import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Categories from "./categories/categories.jsx";
import Places from "./place/places";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Places />} />
            <Route path="/categoryList" element={<Categories />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
