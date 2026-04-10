"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedCounter({ value, suffix = "", duration = 2 }) {
  const counterRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const el = counterRef.current;
    
    // Create an object to tween
    const target = { val: 0 };

    const anim = gsap.to(target, {
      val: value,
      duration: duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Start when element is 85% down viewport
        once: true
      },
      onUpdate: () => {
        setDisplayValue(Math.floor(target.val));
      }
    });

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [value, duration]);

  return (
    <span ref={counterRef}>
      {displayValue}{suffix}
    </span>
  );
}
