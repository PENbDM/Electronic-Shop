// App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import AppRouter from "./components/AppRouter/AppRouter";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store"; // Update the path accordingly

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/*" element={<AppRouter />} />
            </Routes>
          </BrowserRouter>
        </>
      </PersistGate>
    </Provider>
  );
}

export default App;
