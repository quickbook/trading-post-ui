import ContentInfoSection from "../sections/ContentInfoSection";
import FirmDetailsTableSection from "../sections/FirmDetailsTableSection";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./HomePage";

// Option 1: Using styled() API

// Your component using styled API
const CompareFirmsPage = () => {
  // Add loading state
    const [isLoading, setIsLoading] = useState(true);
  
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
