import { FC } from "react";
import styles from "./features.module.scss";
import Link from "next/link";
import { IFeatureCard, IFeatureInfo } from "@/types/landing/feature";
import DOMPurify from "isomorphic-dompurify";
import { isValidGeneralLink, isValidImagePath } from "@/lib/utils";

const FeatureCard: FC<IFeatureCard> = ({ img, title, description, link, cardClass }) => (
  <Link
    href={isValidGeneralLink(link) ? `${DOMPurify.sanitize(link)}` : "#"}
    className={`${styles.features__card} ${cardClass}`}
  >
    <img
      alt={title}
      aria-label={`icon for ${title.toLowerCase()}`}
      src={isValidImagePath(img) ? DOMPurify.sanitize(img) : ""}
    />
    <h4>{title}</h4>
    <p>{description}</p>
  </Link>
);

const Features: FC<IFeatureInfo> = ({ title, description, items }) => (
  <section className={styles.features__container}>
    <div>
      <h2>{title}</h2>
      <p className="landingPagePara" style={{ marginBottom: 30 }}>
        {description}
      </p>
      <div className={`${styles.features} ${styles.features__triple}`}>
        {items.map((feature, i) => {
          return (
            <FeatureCard
              key={i}
              img={feature.img}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              cardClass={`${styles[items.length <= 2 ? "features__card__large" : `"features__card__small"`]} ${
                feature.cardClass
              }`}
            />
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
