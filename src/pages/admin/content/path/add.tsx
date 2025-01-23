import learningPath from "@/actions/learningPath";
import LearningPathForm from "@/components/Admin/LearningPath/LearningPathForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import learningPathSerivices from "@/services/learningPath/LearningPathSerivices";
import { PageSiteConfig } from "@/services/siteConstant";
import { ILearningCourseList } from "@/types/learingPath";
import { StateType } from "@prisma/client";
import { Form, message } from "antd";

import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";

const AddLearningPath: NextPage<{ courseList: ILearningCourseList[]; siteConfig: PageSiteConfig }> = ({
  siteConfig,
  courseList,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [currentState, setCurrentState] = useState<StateType>(StateType.DRAFT);

  const onSubmit = (state: StateType, file?: File) => {
    if (!file) {
      messageApi.warning(`Learning path must have a banner`);
      return;
    }
    // setLoading(true);
    const data = {
      title: form.getFieldsValue().title,
      courses: form.getFieldsValue().courses,
      state: state,
      description: form.getFieldsValue().description,
    };
    const formData = new FormData();
    formData.append("learingPath", JSON.stringify(data));
    file && formData.append("file", file);
    learningPathSerivices.create(
      formData,
      (result) => {
        messageApi.success(result.message);
        form.setFieldsValue({
          title: result.body?.title,
          description: result.body?.description,
          slug: result.body?.slug,
          banner: result.body?.banner,
        });
        result.body?.state && setCurrentState(result.body.state);

        setLoading(false);

        // router.push(`/admin/site/content/${contentType === "UPDATE" ? "updates" : "blogs"}`);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };
  return (
    <AppLayout siteConfig={siteConfig}>
      {contextHolder}
      <LearningPathForm
        loading={loading}
        onSubmit={onSubmit}
        form={form}
        courseList={courseList}
        currentState={currentState}
        title="New Learning Path"
      />{" "}
    </AppLayout>
  );
};
export default AddLearningPath;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  const courseList = await learningPath.getCoursesList();

  return {
    props: {
      siteConfig: site,
      courseList: courseList.body || [],
    },
  };
};
