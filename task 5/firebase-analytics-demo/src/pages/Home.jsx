import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import PremiumSection from "../components/PremiumSection";

import {
  trackLogin,
  trackSignup,
  trackSearch,
  trackButtonClick
} from "../firebase/analytics";

import {
  getNewUIFlag
} from "../firebase/remoteConfig";

function Home() {
  const [showPremium, setShowPremium] =
    useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const flag =
        await getNewUIFlag();

      setShowPremium(flag);
    };

    loadConfig();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>
          Firebase Analytics Project
        </h1>

        <div className="buttons">

          <button
            onClick={trackLogin}
          >
            Login Event
          </button>

          <button
            onClick={trackSignup}
          >
            Signup Event
          </button>

          <button
            onClick={trackSearch}
          >
            Search Event
          </button>

          <button
            onClick={trackButtonClick}
          >
            Button Click Event
          </button>

        </div>

        <ProductCard />

        {
          showPremium &&
          <PremiumSection />
        }

      </div>
    </>
  );
}

export default Home;