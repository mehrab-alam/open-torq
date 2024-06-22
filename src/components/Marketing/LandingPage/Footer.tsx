import appConstant from "@/services/appConstant";
import styles from "@/styles/NavBar.module.scss";
import { Flex } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";

const Footer = () => {
  const footerContent = [
    {
      title: "Resources",
      links: ["Updates", "Blogs", "Changelog"],
    },
    {
      title: "More",
      links: ["Discord", "Github", "Youtube"],
    },
    {
      title: "About Torqbit",
      links: ["The Story", "Team"],
    },
    {
      title: "Legal",
      links: ["Terms & Conditions", "Privacy Policy"],
    },
  ];
  const socialLinks = [
    {
      icon: SvgIcons.discord,
      href: "https://discord.gg/NqP35bn2",
    },
    {
      icon: SvgIcons.github,
      href: "https://github.com/torqbit",
    },
    {
      icon: SvgIcons.youtube,
      href: "https://www.youtube.com/@torqbit",
    },
  ];
  return (
    <section className={styles.footerContainer}>
      <footer>
        <div>
          <Link href={"/landing-page"}>
            <Flex align="center" gap={5}>
              <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} />
              <h4 className="font-brand">{appConstant.platformName.toUpperCase()}</h4>
            </Flex>
          </Link>
          <div className={styles.socialIcons}>
            {socialLinks.map((link, i) => {
              return (
                <Link key={i} href={link.href}>
                  {link.icon}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className={styles.linkWrapper}>
            {" "}
            {footerContent.map((content, i) => {
              return (
                <div key={i} className={styles.linkList}>
                  <h4>{content.title}</h4>
                  <ul>
                    {content.links.map((link, i) => {
                      return <li>{link}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
