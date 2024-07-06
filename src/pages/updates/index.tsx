import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Divider, Flex, Space } from "antd";
import Image from "next/image";
import prisma from "@/lib/prisma";
import styles from "@/styles/Blog.module.scss";
import Link from "next/link";
import UpdateCard from "@/components/Marketing/Updates/UpdateCard";
interface IProps {
  user: User;
  updateData: {
    title: string;
    id: string;
    banner: string;
    authorName: string;
    description: string;
    authorImage: string;
    slug: string;
    updatedAt: string;
  }[];
}

const updatePage: FC<IProps> = ({ user, updateData }) => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 415px)" });

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  return (
    <MarketingLayout
      user={user}
      heroSection={<HeroBlog title="Updates" description="New changes to our learning platform & courses" />}
    >
      {updateData.length === 0 ? (
        <div
          style={{
            height: 400,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: globalState.theme === "dark" ? "#283040" : "#fff",
            color: globalState.theme === "dark" ? "#fff" : "#000",
          }}
        >
          <p
            style={{
              maxWidth: isMobile ? 300 : 400,
              lineHeight: 1.5,
            }}
          >
            There are no updates currently. Visit here later again
          </p>
        </div>
      ) : (
        // <div className={styles.blogListPageWrapper}>
        //   <div className={styles.primaryBlog}>
        //     {blogData.slice(0, 2).map((blog, i) => {
        //       return (
        //         <Link href={`/blogs/${blog.slug}`} key={i} onClick={() => {}} className={styles.blogCard}>
        //           <Image src={blog.banner} alt="blog-img" height={isMobile ? 175 : 250} width={isMobile ? 350 : 500} />
        //           <div>
        //             <Flex className={styles.authorInfo} align="center" gap={10}>
        //               <Image src={blog.authorImage} alt="blog-img" height={40} width={40} />
        //               <Space direction="vertical" size={5}>
        //                 <span>A blog by a</span>
        //                 <div>{blog.authorName}</div>
        //               </Space>
        //             </Flex>
        //             <h1>{blog.title}</h1>
        //           </div>
        //         </Link>
        //       );
        //     })}
        //   </div>
        //   <div>
        //     <div className={styles.secondaryBlog}>
        //       {blogData.slice(2).map((blog, i) => {
        //         return (
        //           <Link href={`/blogs/${blog.slug}`} key={i} onClick={() => {}} className={styles.blogCard}>
        //             <Image src={blog.banner} alt="blog-img" height={175} width={350} />
        //             <div className={styles.infoWrapper}>
        //               <Flex className={styles.authorInfo} align="center" gap={10}>
        //                 <Image src={blog.authorImage} alt="blog-img" height={40} width={40} />
        //                 <Space direction="vertical" size={5}>
        //                   <span>A blog by</span>
        //                   <div>{blog.authorName}</div>
        //                 </Space>
        //               </Flex>
        //               <h2>{blog.title}</h2>
        //             </div>
        //           </Link>
        //         );
        //       })}
        //     </div>
        //   </div>
        // </div>
        <div className={styles.updateListPageWrapper}>
          {updateData.map((data, i) => {
            console.log(data);
            return (
              <div key={i}>
                <UpdateCard
                  date={data.updatedAt}
                  title={data.title}
                  img={data.banner}
                  description={data.description}
                  href={`/updates/${data.slug}`}
                  slug={data.slug}
                  link={"Read more"}
                />
              </div>
            );
          })}
        </div>
      )}
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const update = (await prisma.blog.findMany({
    where: {
      type: "UPDATE",
      state: "ACTIVE",
    },
    select: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
      content: true,
      title: true,
      id: true,
      banner: true,
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })) as any;

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (update.length > 0) {
    return {
      props: {
        user,
        blogData: update.map((b: any) => {
          return {
            title: b.title,
            description: b.content.content[0].content[0].text,
            id: b.id,
            banner: b.banner,
            authorName: b.user.name,
            authorImage: b.user.image,
            slug: b.slug,
            updatedAt: b.updatedAt.toISOString(),
          };
        }),
      },
    };
  } else {
    return {
      props: {
        user,
        blogData: [],
      },
    };
  }
};

export default updatePage;
