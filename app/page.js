'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const REDIRECT_DELAY = 3000; // 3 seconds
const TARGET_URL = 'https://facebook.com';

export default function Preloader() {
  const [timeLeft, setTimeLeft] = useState(REDIRECT_DELAY / 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = TARGET_URL;
    }, REDIRECT_DELAY);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.loaderWrapper}>
        {/* Animated Spinner */}
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>

        {/* Loading Text */}
        <h1 className={styles.title}>Opening file...</h1>
        <p className={styles.subtitle}>Please wait while we prepare your document</p>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span className={styles.timer}>
            Redirecting in {timeLeft} second{timeLeft !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Fallback Link */}
        <div className={styles.fallback}>
          <p>If nothing happens, <a href={TARGET_URL} className={styles.link}>click here</a></p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={styles.bgDecoration}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </main>
  );
}