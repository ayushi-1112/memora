import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function PageWrapper({ children }) {
  const pageRef = useRef();
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [location.pathname]);

  return <div ref={pageRef} className="page-wrapper">{children}</div>;
}
