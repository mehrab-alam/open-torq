import SvgIcons from "@/components/SvgIcons";
import { convertSecToHourandMin } from "@/pages/admin/content";
import styles from "@/styles/Marketing/CoursePreview/CoursePreview.module.scss";
import { Button, Collapse, Divider, Flex, Form, Input, Space, Tag, message } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { ICoursePageDetail } from "@/types/courses/Course";
import { $Enums, CourseState, CourseType, ResourceContentType, Role, User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import NotificationService from "@/services/NotificationService";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { useSession } from "next-auth/react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
  contentType?: ResourceContentType;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId, contentType }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {isCompleted ? SvgIcons.check : icon}
            <div>{title}</div>
          </Flex>
        </div>
        <div>{<Tag className={styles.time_tag}>{time}</Tag>}</div>
      </Flex>
    </div>
  );
};
const CoursePreview: FC<{ user: User; courseId: number; nextLessonId?: number; courseDetails: ICoursePageDetail }> = ({
  user,
  courseId,
  courseDetails,
  nextLessonId,
}) => {
  const { data: session, status } = useSession();
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);
  const [isNotified, setNotified] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [email, setEmail] = useState<string>("");
  const courseListDetail = courseDetails && {
    course: {
      name: courseDetails.name,
      description: courseDetails.description,
      courseTrailer: courseDetails.tvUrl,
      difficulty: courseDetails.difficultyLevel,
    },

    chapters:
      courseDetails.chapters &&
      courseDetails.chapters.map((chapter) => {
        return {
          chapterSeq: chapter.chapterSeq,
          chapterName: chapter.chapterName,

          lessons: chapter.lessons.map((r) => {
            return {
              title: r.title,
              videoDuration:
                r.contentType === ResourceContentType.Assignment ? Number(r.estimatedDuration) * 60 : r.videoDuration,
              lessonId: r.lessonId,
              contentType: r.contentType,
            };
          }),
        };
      }),
  };

  const items =
    courseListDetail &&
    courseListDetail.chapters.map((content, i) => {
      let totalTime = 0;
      content.lessons.forEach((data) => {
        if (data.videoDuration) {
          totalTime = totalTime + data.videoDuration;
        }
      });
      const duration = convertSecToHourandMin(totalTime);
      return {
        key: `${i + 1}`,
        label: <Label title={content.chapterName} icon={SvgIcons.folder} time={duration} keyValue={`${i + 1}`} />,
        children: content.lessons.map((res: any, i: any) => {
          const duration = convertSecToHourandMin(res.videoDuration);
          return (
            <div className={styles.resContainer}>
              <Label
                title={res.title}
                icon={res.contentType === $Enums.ResourceContentType.Video ? SvgIcons.playBtn : SvgIcons.file}
                time={duration}
                isCompleted={res.isWatched}
                resourceId={res.videoId}
                keyValue={`${i + 1}`}
                contentType={res.contentType}
              />
            </div>
          );
        }),
        showArrow: false,
      };
    });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items ? items.map((item, i) => `${i + 1}`) : []);
  let duration: number = 0;

  courseDetails &&
    courseDetails.chapters.forEach((chapter) => {
      chapter.lessons.forEach((r) => {
        duration =
          r.contentType === ResourceContentType.Assignment
            ? duration + Number(r.estimatedDuration) * 60
            : duration + r.videoDuration;
      });
    });

  const totalDuration = convertSecToHourandMin(duration);

  const courseFeatures = courseDetails && [
    {
      icon: MarketingSvgIcons.info,
      label: courseDetails.state === "ACTIVE" ? "Available for all" : "Launching soon ",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: courseDetails.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: courseDetails.state === "ACTIVE" ? totalDuration : "N/A",
    },
    {
      icon: MarketingSvgIcons.certificate,
      label: "Certificate on course completion",
    },
  ];

  const previewCourseFeatures = courseDetails && [
    {
      icon: MarketingSvgIcons.info,
      label: courseDetails.state === "ACTIVE" ? "Available for all" : "Launching soon ",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: courseDetails.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: courseDetails.state === "ACTIVE" ? `${totalDuration} of content` : "N/A",
    },
  ];

  const onCreateNotification = (isEmailVerified: boolean, email: string) => {
    setNotificationLoading(true);
    NotificationService.createCourseNotification(
      courseId,
      email,
      isEmailVerified,
      (result) => {
        message.success(result.message);
        setNotified(true);
        setEmail("");
        setNotificationLoading(false);
      },
      (error) => {
        message.success(error);
        setNotificationLoading(false);
      }
    );
  };

  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };

  useEffect(() => {
    if (user) {
      NotificationService.checkCourseNotifications(
        courseId,
        (result) => {
          setNotified(result.mailSent);
          setNotificationLoading(false);
        },
        (error) => {
          setNotificationLoading(false);
        }
      );
    }
  }, [user]);

  const showFeatures = courseDetails.previewMode ? previewCourseFeatures : courseFeatures;

  return (
    <section className={styles.coursePreview}>
      {courseDetails ? (
        <div className={styles.coursePreviewContainer}>
          <div className={styles.courseInfoWrapper}>
            <Space direction="vertical">
              <div>
                <div className={styles.descriptionWrapper}>
                  <h2>Description</h2>
                  <p>{courseDetails.description}</p>
                </div>
              </div>
              {courseDetails.chapters.length > 0 && (
                <div className={styles.chapter_list}>
                  <h1>Chapters</h1>

                  <Collapse
                    onChange={onChange}
                    activeKey={activeCollapseKey}
                    size="small"
                    defaultActiveKey={activeCollapseKey}
                    accordion={false}
                    items={
                      items &&
                      items.map((item) => {
                        return {
                          key: item.key,
                          label: item.label,
                          children: item.children,
                          showArrow: false,
                        };
                      })
                    }
                  />
                </div>
              )}
            </Space>

            <div>
              <div className={styles.courseEnrollmentCard}>
                <div className={styles.cardWrapper}>
                  <Image src={courseDetails.thumbnail} height={375} width={375} alt="" loading="lazy" />
                  <div className={styles.cardDetail}>
                    <div>
                      <Flex align="center" justify="space-between">
                        <span>Details</span>
                        {courseDetails.previewMode ? (
                          "Free to preview"
                        ) : (
                          <>
                            {courseDetails.courseType === CourseType.PAID ? (
                              <Flex align="center" gap={5}>
                                {SvgIcons.rupees} <span>{courseDetails.coursePrice}</span>
                              </Flex>
                            ) : (
                              "Free"
                            )}
                          </>
                        )}
                      </Flex>
                    </div>
                    <div>
                      {showFeatures &&
                        showFeatures.length > 0 &&
                        showFeatures.map((c, i) => {
                          return (
                            <Flex key={i} align="center" gap={10}>
                              <i>{c.icon}</i>
                              <div>{c.label}</div>
                            </Flex>
                          );
                        })}
                    </div>
                  </div>
                  <Divider />
                  {courseDetails.state === "ACTIVE" ? (
                    <>
                      {(courseDetails.userRole === Role.ADMIN || courseDetails.userRole === Role.AUTHOR) &&
                        status === "authenticated" && (
                          <Link
                            className={styles.buttonWrapper}
                            href={`/courses/${courseDetails.courseId}/lesson/${nextLessonId}`}
                          >
                            <Button type="primary">View Course</Button>
                          </Link>
                        )}
                      {courseDetails.userRole === Role.STUDENT && status === "authenticated" && (
                        <>
                          {courseDetails.userStatus === CourseState.COMPLETED ? (
                            <Link
                              className={styles.buttonWrapper}
                              href={`/courses/${courseDetails.courseId}/lesson/${nextLessonId}`}
                            >
                              <Button type="primary">Rewatch</Button>
                            </Link>
                          ) : (
                            <>
                              {courseDetails.progress > 0 ? (
                                <Link
                                  className={styles.buttonWrapper}
                                  href={`/courses/${courseDetails.courseId}/lesson/${nextLessonId}`}
                                >
                                  <Button type="primary">Resume</Button>
                                </Link>
                              ) : (
                                <Link
                                  className={styles.buttonWrapper}
                                  href={`/courses/${courseDetails.courseId}/lesson/${nextLessonId}`}
                                >
                                  <Button type="primary">Start Course</Button>
                                </Link>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {courseDetails.userRole === "NOT_ENROLLED" && status === "authenticated" && (
                        <Link href={`/courses/${courseDetails.courseId}`} className={styles.buttonWrapper}>
                          {courseDetails.courseType === CourseType.PAID ? (
                            <Button type="primary">
                              <Flex align="center" gap={5} justify="center">
                                {SvgIcons.lock}
                                <span>Buy Now</span>
                              </Flex>
                            </Button>
                          ) : (
                            <Button type="primary">
                              {courseDetails.previewMode ? "Preview Course" : "Enroll for Free"}
                            </Button>
                          )}
                        </Link>
                      )}
                      {(courseDetails.userRole === Role.NA || status === "unauthenticated") && (
                        <Link
                          href={`/login?redirect=courses/${courseDetails.courseId}`}
                          className={styles.buttonWrapper}
                        >
                          <Button type="primary">Login to Continue</Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <Form
                      form={form}
                      onFinish={() => {
                        user ? onCreateNotification(true, String(user.email)) : onCreateNotification(false, email);
                      }}
                    >
                      <Flex vertical className={styles.buttonWrapper} gap={10}>
                        {!user && (
                          <Form.Item name={"email"} noStyle rules={[{ required: true, message: "Enter your email" }]}>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Item>
                        )}
                        <Button loading={notificationLoading} disabled={isNotified} htmlType="submit" type="primary">
                          Notify on launch
                        </Button>
                      </Flex>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SpinLoader />
      )}
    </section>
  );
};

export default CoursePreview;
