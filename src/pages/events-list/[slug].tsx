import { useAppContext } from "@/components/ContextApi/AppContext";
import { checkDateExpired, convertToDayMonthTime, generateYearAndDayName, getCookieName } from "@/lib/utils";
import { StateType, Theme, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect } from "react";
import prisma from "@/lib/prisma";
import { IEventInfo } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Breadcrumb } from "antd";

import EventInfo from "@/components/Events/EventInfo";
import Layout2 from "@/components/Layouts/Layout2";
import { truncateString } from "@/services/helper";

const EventInfoPage: FC<{ user: User; eventInfo: IEventInfo; registrationExpired: boolean }> = ({
  user,
  eventInfo,
  registrationExpired,
}) => {
  return (
    <Layout2>
      <div className={styles.event_list_info_wrapper}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            {
              title: <a href="/events-list"> Events</a>,
            },
            {
              title: `${truncateString(eventInfo.title, 25)}`,
              className: styles.courseName,
            },
          ]}
        />
        <div className={styles.events_banner}>
          <img src={eventInfo?.banner} alt="banner" />
        </div>
        <EventInfo
          user={user}
          eventInfo={eventInfo}
          registrationExpired={registrationExpired}
          eventListLink="events-list"
          classNames="events_content_wrapper"
        />
      </div>
    </Layout2>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;

  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const eventInfo = await prisma.events.findUnique({
    where: {
      state: StateType.ACTIVE,
      slug: String(params?.slug),
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
      banner: true,
      eventMode: true,
      price: true,

      eventType: true,
      eventInstructions: true,
      location: true,
      slug: true,
      description: true,
      eventLink: true,
      registrationEndDate: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  if (user) {
    if (eventInfo) {
      let registrationExpired = eventInfo.registrationEndDate && checkDateExpired(eventInfo.registrationEndDate);
      return {
        props: {
          user,
          eventInfo: {
            ...eventInfo,
            startTime: eventInfo?.startTime ? convertToDayMonthTime(eventInfo?.startTime) : "",
            endTime: eventInfo?.endTime ? convertToDayMonthTime(eventInfo?.endTime) : "",
            registrationEndDate: eventInfo?.registrationEndDate
              ? generateYearAndDayName(eventInfo?.registrationEndDate)
              : "",
          },
          registrationExpired,
        },
      };
    } else {
      return {
        props: {
          user,
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/unauthorized",
      },
    };
  }
};
export default EventInfoPage;
