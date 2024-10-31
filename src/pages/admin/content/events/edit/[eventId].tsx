import BlogForm from "@/components/Admin/Content/BlogForm";
import Layout2 from "@/components/Layouts/Layout2";
import { GetServerSidePropsContext, NextPage } from "next";
import prisma from "@/lib/prisma";

import { FC } from "react";
import { Events, StateType } from "@prisma/client";
import EventForm from "@/components/Events/EventForm";

interface IProps {
  eventDetails: Events;
}
const EventFormPage: FC<IProps> = ({ eventDetails }) => {
  return (
    <>
      <Layout2>
        <EventForm details={eventDetails} />
      </Layout2>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;

  const eventDetails = await prisma.events.findUnique({
    where: {
      id: Number(params?.eventId),
    },
    select: {
      id: true,
      title: true,
      banner: true,
      slug: true,
      description: true,
      startTime: true,
      endTime: true,
      eventType: true,
      price: true,
      eventInstructions: true,
      eventLink: true,
      location: true,
      eventMode: true,
      state: true,
      certificate: true,
      certificateTemplate: true,
      registrationEndDate: true,
    },
  });
  if (eventDetails) {
    return {
      props: {
        eventDetails: {
          ...eventDetails,
          startTime: String(eventDetails.startTime),
          endTime: String(eventDetails.endTime),
          registrationEndDate: String(eventDetails.registrationEndDate),
        },
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/admin/content",
      },
    };
  }
};
export default EventFormPage;
