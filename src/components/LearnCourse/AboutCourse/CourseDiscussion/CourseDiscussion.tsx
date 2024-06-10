import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Button, Divider, Drawer, message, Upload } from "antd";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { Discussion } from "@prisma/client";
import QAForm from "./DiscussionForm";
import CommentBox from "./CommentBox";
import ReplyDrawer from "./ReplyDrawer";
import { useRouter } from "next/router";
import { useAppContext } from "@/components/ContextApi/AppContext";
import DiscussionsService from "@/services/DiscussionsService";
import NotificationService from "@/services/NotificationService";

export interface IComments extends Discussion {
  comment: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export interface IReplyDrawer {
  isOpen: boolean;
  sltCommentId: number;
}

const QADiscssionTab: FC<{ resourceId: number; userId: string; loading: boolean }> = ({
  resourceId,
  userId,
  loading,
}) => {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const query = router.query;
  const [allComments, setAllComments] = useState<IComments[]>([]);
  const [pageSize, setPageSize] = useState<number>(3);
  const [totalCmt, setTotalCmt] = useState<number>(0);

  const [listLoading, setListLoading] = useState<boolean>(false);
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
    sltCommentId: 0,
  });

  const showReplyDrawer = (comment: IComments) => {
    setReplyDrawer({
      isOpen: true,
      sltCommentId: comment.id,
    });
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: 0 });
  };

  const getAllDiscussioin = async (resId: number, pageSize: number) => {
    setListLoading(true);
    DiscussionsService.getCommentsList(
      resourceId,
      pageSize,
      (result) => {
        setAllComments(result.allComments);
        setTotalCmt(result.total);
      },
      (error) => {
        message.error(error);
      }
    );

    setListLoading(false);
  };
  const fetchAllDiscussion = () => {
    if (resourceId) {
      getAllDiscussioin(resourceId, pageSize);
    }
  };

  React.useEffect(() => {
    if (resourceId) {
      setPageSize(3);
      fetchAllDiscussion();
    }
  }, [resourceId]);

  const updateNotification = async () => {
    try {
      NotificationService.updateNotification(
        Number(query.notifi),

        (result) => {
          fetchAllDiscussion();
        },
        (error) => {
          message.error(error);
        }
      );
    } catch (err) {}
  };

  React.useEffect(() => {
    if (query.comment) {
      setReplyDrawer({
        sltCommentId: Number(query.comment),
        isOpen: true,
      });
      updateNotification();
    }
  }, [query.notifi, query.comment]);

  const oClickMore = () => {
    if (totalCmt > pageSize) {
      const newPageSize = pageSize + 5;
      setPageSize(newPageSize);
      getAllDiscussioin(resourceId, newPageSize);
    }
  };
  const onPostQA = async (comment: string) => {
    try {
      DiscussionsService.postParentComment(
        resourceId,
        Number(router.query.courseId),
        comment,
        (result) => {
          message.success("Comment Added");
          fetchAllDiscussion();

          onCloseDrawer && onCloseDrawer();
        },
        (error) => {
          message.error("Comment not Added");
        }
      );
    } catch (error) {}
  };

  return (
    <section className={styles.qa_discussion_tab}>
      <QAForm loadingPage={loading} resourceId={resourceId} placeholder="Ask a Question" onPost={onPostQA} />

      {allComments.map((comment, i) => {
        return (
          <CommentBox
            resourceId={resourceId}
            showReplyDrawer={showReplyDrawer}
            comment={comment}
            key={i}
            replyList={false}
            fetchAllDiscussion={fetchAllDiscussion}
          />
        );
      })}

      <ReplyDrawer
        replyDrawer={replyDrawer}
        resourceId={resourceId}
        onCloseDrawer={onCloseDrawer}
        fetchAllDiscussion={fetchAllDiscussion}
      />
      {totalCmt !== allComments.length && (
        <Divider>
          <Button type="text" loading={listLoading} className={styles.load_more_comment} onClick={oClickMore}>
            Load More
          </Button>
        </Divider>
      )}
    </section>
  );
};

export default QADiscssionTab;
