import ContentInfoSection from "../sections/ContentInfoSection";
import FirmDetailsTableSection from "../sections/FirmDetailsTableSection";
import { useContext, useEffect, useState } from "react";
import { LoadingScreen } from "./HomePage";
import { MainContext } from "../../App";

// Option 1: Using styled() API

// Your component using styled API
const CompareFirmsPage = () => {
  // Add loading state
    const {isLoading, setIsLoading} = useContext(MainContext);
  
    // Simulate loading effect
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Show loading for 1 second
  
      return () => clearTimeout(timer);
    }, []);
  
    return isLoading ? (
      <LoadingScreen />
    ) : (
    <>
      {/* <FirmsFilterSection /> */}
      <FirmDetailsTableSection />
    </>
  );
};

export default CompareFirmsPage;
