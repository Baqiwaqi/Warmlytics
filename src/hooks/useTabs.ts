import { useState } from "react";

const useTabs = () => {
   const [currentIndex, setCurrentIndex] = useState(0);

   const handleTabs = (index: number) => {
      setCurrentIndex(index);
   }

   return {
      currentIndex,
      handleTabs,
   }

}

export default useTabs;