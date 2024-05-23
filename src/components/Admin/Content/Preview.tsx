import { useAppContext } from "@/components/ContextApi/AppContext";
import SvgIcons from "@/components/SvgIcons";
import { IResourceDetail } from "@/lib/types/learn";
import { convertSecToHourandMin } from "@/pages/admin/content";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { ChapterDetail, CourseData, CourseInfo, VideoInfo } from "@/types/courses/Course";
import { Button, Collapse, Flex, Space, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { FC, ReactNode, useEffect, useState } from "react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  onRender: (value: string[]) => void;
  render: string[];
  icon: ReactNode;
}> = ({ title, time, onRender, render, keyValue, icon, resourceId }) => {
  const [completed, setCompleted] = useState<boolean>();
  const onActive = (value: string[]) => {
    if (render.includes(value[0])) {
      let currentValue = render.filter((v) => v !== value[0]);
      onRender(currentValue);
    } else {
      render.push(value[0]);
    }
  };

  useEffect(() => {
    resourceId &&
      ProgramService.checkProgress(
        resourceId,
        (result) => {
          setCompleted(result.completed);
        },
        (error) => {}
      );
  }, []);
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {completed ? SvgIcons.check : icon}
            <div style={{ cursor: "pointer" }} onClick={() => onActive([keyValue])}>
              {title}
            </div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
    </div>
  );
};

const Preview: FC<{
  courseDetail?: CourseInfo | CourseData;
  addContentPreview?: boolean;
  videoUrl?: string;
  uploadVideo?: VideoInfo;
  chapter: ChapterDetail[];
  enrolled?: boolean;
  isCourseCompleted?: boolean;
  onEnrollCourse?: () => void;
  isCourseStarted?: boolean;
}> = ({
  uploadVideo,
  chapter,
  addContentPreview,
  videoUrl,
  onEnrollCourse,
  enrolled,
  isCourseCompleted,
  courseDetail,
  isCourseStarted,
}) => {
  const router = useRouter();
  const renderKey = chapter.map((c, i) => {
    return `${i + 1}`;
  });
  const [render, setRender] = useState(renderKey);

  const items = chapter.map((content, i) => {
    let totalTime = 0;
    content.resource.forEach((data) => {
      totalTime = totalTime + data.video?.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={duration}
          onRender={setRender}
          render={render}
          keyValue={`${i + 1}`}
        />
      ),
      children: content.resource
        .filter((r) => (addContentPreview ? r.state === "ACTIVE" || r.state === "DRAFT" : r.state === "ACTIVE"))
        .map((res: IResourceDetail, i: any) => {
          const duration = convertSecToHourandMin(res.video?.videoDuration);
          return (
            <div className={styles.resContainer}>
              <Label
                title={res.name}
                icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
                time={duration}
                onRender={setRender}
                resourceId={res.resourceId}
                render={render}
                keyValue={`${i + 1}`}
              />
            </div>
          );
        }),
      showArrow: false,
    };
  });

  const onViewCertificate = () => {
    ProgramService.getCertificate(
      Number(router.query.courseId),
      (result) => {
        const id = String(result?.certificateDetail?.getIssuedCertificate?.id);
        router.push(`/courses/${router.query.courseId}/certificate/${id}`);
      },
      (error) => {}
    );
  };
  return (
    <section className={styles.preview_container}>
      <Space direction="vertical">
        <div style={{ fontSize: 20 }} className={styles.coursehHeaderLinks}>
          {courseDetail && !addContentPreview && (
            <Flex>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <div>{courseDetail.name}</div>
            </Flex>
          )}
        </div>
        <div className={styles.video_container}>
          {
            <iframe
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                outline: "none",
                border: "none",
              }}
              src={videoUrl ? videoUrl : uploadVideo?.videoUrl}
            ></iframe>
          }
          <div className={styles.video_player_info}>
            <Space direction="vertical">
              <h2>{courseDetail?.name}</h2>
              <p>{courseDetail?.description}</p>
            </Space>

            {enrolled ? (
              <>
                {isCourseCompleted ? (
                  <Flex align="center" gap={10}>
                    <Button onClick={onViewCertificate}>View Certificate</Button>

                    <Link href={`/courses/${chapter[0]?.courseId}/lesson/${chapter[0].resource[0].resourceId}`}>
                      <Button type="primary">Rewatch</Button>
                    </Link>
                  </Flex>
                ) : (
                  <Button
                    className={styles.save_btn}
                    type="primary"
                    onClick={() => {
                      !addContentPreview && onEnrollCourse && onEnrollCourse();
                    }}
                  >
                    {!isCourseStarted ? "Start Course" : "Resume"}
                    {SvgIcons.arrowRight}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  className={styles.save_btn}
                  type="primary"
                  onClick={() => {
                    !addContentPreview && onEnrollCourse && onEnrollCourse();
                  }}
                >
                  Enroll Course
                  {SvgIcons.arrowRight}
                </Button>
              </>
            )}
          </div>
        </div>

        <h2>Table of Contents</h2>
        <div>
          {items.map((item, i) => {
            return (
              <div key={i} className={styles.chapter_list}>
                <Collapse
                  defaultActiveKey={"1"}
                  size="small"
                  accordion={false}
                  activeKey={render}
                  items={[
                    {
                      key: item.key,
                      label: item.label,
                      children: item.children,
                      showArrow: false,
                    },
                  ]}
                />
              </div>
            );
          })}
        </div>
      </Space>
    </section>
  );
};

export default Preview;
