'use client';
import { useEffect } from 'react';
import styles from './page.module.css';

// Redirect delay in milliseconds
const REDIRECT_DELAY = 3000;

export default function TrainPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to external site or home page
      window.location.href = 'https://example.com';

      // Alternative: Close tab (works for tabs opened via script)
      // window.close();
    }, REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.animationWrapper}>
        {/* Animated Train */}
        <div className={styles.train}>
          <div className={styles.locomotive}>
            <div className={styles.cabin}></div>
            <div className={styles.wheels}>
              <div className={styles.wheel}></div>
              <div className={styles.wheel}></div>
            </div>
          </div>
          <div className={styles.coach}></div>
        </div>

        {/* Speed lines effect */}
        <div className={styles.speedLines}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>🚂 Hold On, Speedy!</h1>
        <p className={styles.subtitle}>You're being redirected for security reasons...</p>

        <div className={styles.loaderContainer}>
          <div className={styles.loadingBar}>
            <div className={styles.progress}></div>
          </div>
          <span className={styles.timeCounter}>Redirecting in 3 seconds</span>
        </div>

        <div className={styles.infoBox}>
          <p>If you are not redirected automatically,</p>
          <a href="https://example.com" className={styles.link}>
            click here to continue
          </a>
        </div>
      </div>
    </main>
  );
}