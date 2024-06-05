import React from 'react';
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export function FadeIn({ children, duration }: { children: React.ReactNode, duration: number }) {
  const ref = useRef(null);
  const isInView: boolean = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView)
      mainControls.start("visible");
  }, [isInView, mainControls]);

  return <div ref={ref}>
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      initial="hidden" animate={mainControls} transition={{ duration }}>
      {children}
    </motion.div>
  </div>;
}

export function SlideIn({ children, duration, delay, className }: { children: React.ReactNode, duration: number, delay: number, className: string }) {
  const ref = useRef(null);
  const isInView: boolean = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView)
      mainControls.start("visible");

  }, [isInView, mainControls]);

  return <div ref={ref} className={className}>
    <motion.div
      variants={{ hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }}
      initial="hidden" animate={mainControls} transition={{ duration, delay }} className="h-full">
      {children}
    </motion.div>
  </div>;
}