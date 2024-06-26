import { FC } from "react";
import styles from "@/styles/NavBar.module.scss";
import SvgComponent from "../LandingPage/HeroWave";

const DefaulttHero: FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <section className={styles.heroBlogWrapper}>
      <div className={styles.heroWaveIcon}>
        <SvgComponent className={styles.heroWave} />
      </div>
      <div className={styles.blogContentContainer}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default DefaulttHero;
