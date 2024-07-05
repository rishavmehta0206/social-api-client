import { useEffect, useRef, useState } from "react";

export const useModalClose = () => {
  const [modal, setModal] = useState(false);
  let elementRef = useRef();

  const hideModal = () => setModal(false);

  function handleModalEvent(event) {
    if (elementRef.current && !elementRef.current.contains(event.target)) {
      hideModal();
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleModalEvent);

    return () => window.removeEventListener("mousedown", handleModalEvent);
  }, []);

  return { modal, elementRef,setModal};
};
