import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Avatar, Button, Input, Popconfirm, Space, message } from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import moment from "moment";
import { IComments } from "./CourseDiscussion";
import ImagePreview from "@/components/ImagePreview/ImagePreview";
import { customFromNow } from "@/services/momentConfig";
import DiscussionsService from "@/services/DiscussionsService";
import NotificationService from "@/services/NotificationService";
import SvgIcons from "@/components/SvgIcons";
moment.locale("en", { ...customFromNow });

export interface IAttachedFiles {
  url: string;
  fileId: string;
  caption?: string;
}

const CommentBox: FC<{
  resourceId: number;
  parentCommentId?: number;
  comment: IComments;
  replyList: boolean;

  showReplyDrawer: (cmt: IComments) => void;
  reFreshReplyCommnet?: boolean;
  allComment?: IComments[];
  setAllComment: (value: IComments[]) => void;
}> = ({
  comment,

  replyList,
  resourceId,
  parentCommentId,
  showReplyDrawer,
  allComment,
  setAllComment,
}) => {
  const { data: session } = useSession();
  const [isEdited, setEdited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editActive, setEditActive] = useState<boolean>(false);
  const [isReply, setReply] = useState<{ open: boolean; id: number }>({ open: false, id: 0 });
  const [allReplyCmtCount, setAllReplyCmtCount] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>("");
  const attachedFiles = comment.attachedFiles as any;

  const getTotalReplyCmt = async (id: number) => {
    DiscussionsService.getTotalReplies(
      id,
      (result) => {
        setAllReplyCmtCount(result.allReplyCmts);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  React.useEffect(() => {
    getTotalReplyCmt(comment.id);
  }, [comment.id]);

  const onDeleteComment = async (cmtId: number) => {
    DiscussionsService.deleteComment(
      cmtId,
      (result) => {
        message.success(result.message);
        const commentLeft = allComment?.filter((c) => c.id !== cmtId);
        commentLeft && setAllComment(commentLeft);
        if (replyList) {
          getTotalReplyCmt(comment.id);
        }
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onUpdateMultipleNotificaton = () => {
    session?.id &&
      NotificationService.updateMultipleNotification(
        comment.id,
        (result) => {},
        (error) => {}
      );
  };

  const onEditComment = async () => {
    if (!editComment || comment.comment.trim() == editComment.trim()) {
      setEdited(false);
      return;
    }
    setLoading(true);
    DiscussionsService.updateComment(
      comment.id,
      editComment,
      (result) => {
        comment.comment = editComment;
        message.success(result.message);
        setEditComment(result.comment.comment);
        setEdited(false);
      },
      (error) => {
        message.error(error);
      }
    );

    setLoading(false);
  };

  return (
    <>
      <div
        className={styles.comment_box}
        key={comment.id}
        id={`comment_${comment.id}`}
        onMouseOver={() => {
          setEditActive(true);
        }}
        onMouseLeave={() => setEditActive(false)}
      >
        <Avatar size={40} src={comment.user.image} icon={<UserOutlined />} className={styles.user_icon} alt="Profile" />
        <div className={styles.comment}>
          <Space className={styles.user_info}>
            <h4>{comment.user.name}</h4>
            <p className="dot">•</p>
            <h5 className={styles.comment_time}>
              {moment(new Date(comment.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}
            </h5>
          </Space>
          <div className={`${styles.comment_body} comment-card-body`}>
            {editActive && (
              <div className={styles.comment_body_header}>
                {session?.id === comment.user.id && (
                  <Space className={styles.comment_action_btns}>
                    {isEdited ? (
                      <CloseOutlined onClick={() => setEdited(false)} />
                    ) : (
                      <div
                        onClick={() => {
                          setEdited(true);
                          setEditComment(comment.comment);
                        }}
                      >
                        {SvgIcons.edit}
                      </div>
                    )}

                    <Popconfirm
                      title="Delete the post"
                      description="Are you sure to delete this post?"
                      onConfirm={() => onDeleteComment(comment.id)}
                      okText="Yes"
                      cancelText="Continue"
                    >
                      {SvgIcons.delete}
                    </Popconfirm>
                  </Space>
                )}
              </div>
            )}
            <div className={styles.comment_content}>
              {isEdited ? (
                <Input.TextArea
                  placeholder="Edit Post"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) {
                      onEditComment();
                    }
                  }}
                  className={styles.qa_edit_input}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
              ) : (
                <div className={styles.comment_text_wrapper}>{comment.comment}</div>
              )}
            </div>
          </div>
          {!replyList && (
            <div className={styles.comment_footer}>
              <div className={styles.reply_btn}>
                {isEdited ? (
                  <Space>
                    <Button type="primary" loading={loading} size="small" onClick={onEditComment}>
                      Save
                    </Button>
                    <Button size="small" onClick={() => setEdited(false)}>
                      Cancel
                    </Button>
                  </Space>
                ) : (
                  <Space align="center">
                    {
                      <span
                        onClick={() => {
                          onUpdateMultipleNotificaton();
                          showReplyDrawer(comment);
                        }}
                      >
                        {allReplyCmtCount === 0 && "Reply"}
                        {isReply.open ? (
                          "Cancel"
                        ) : (
                          <span>
                            {allReplyCmtCount > 0 && (
                              <span>
                                {" "}
                                {allReplyCmtCount === 1 ? `${allReplyCmtCount} Reply` : `${allReplyCmtCount} Replies`}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    }

                    {attachedFiles?.length > 0 && (
                      <ImagePreview imgs={attachedFiles?.map((img: IAttachedFiles) => img.url)} />
                    )}
                  </Space>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentBox;
