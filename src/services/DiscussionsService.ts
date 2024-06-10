import { Course, Discussion } from "@prisma/client";

import { getFetch, postFetch } from "./request";
import { IComments } from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CourseDiscussion";
export interface ICourseList extends Course {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

export type ApiResponse = {
  success: boolean;
  error: string;
  newComment: Discussion;
  comment: IComments;
  allComments: IComments[];
  allReplyComments: IComments[];
  total: number;
  allReplyCmts: number;
  message: string;
};

type FailedApiResponse = {
  error: string;
};
class DiscussionsSerivice {
  postQuery = (
    lessonId: number,
    courseId: number,
    comment: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ lessonId: lessonId, courseId: courseId, comment: comment }, `/api/v1/discussions/post/`).then(
      (result) => {
        if (result.status == 400) {
          result.json().then((r) => {
            const failedResponse = r as FailedApiResponse;
            onFailure(failedResponse.error);
          });
        } else if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as ApiResponse;
            onSuccess(apiResponse);
          });
        }
      }
    );
  };

  postReply = (
    lessonId: number,
    courseId: number,
    comment: string,
    parentCommentId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(
      { lessonId: lessonId, courseId: courseId, comment: comment, parentCommentId: parentCommentId },
      `/api/v1/discussions/add-reply-post/`
    ).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  deleteComment = (id: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/discussions/delete/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getComment = (id: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/discussions/get/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getCommentsList = (
    resourceId: number,
    pageSize: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/get-list/${resourceId}?pageSize=${pageSize}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getTotalReplies = (
    parentCmtId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/get-list/reply/count/${parentCmtId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getAllReplies = (
    parentCmtId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/get-list/reply/${parentCmtId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  updateComment = (
    id: number,
    comment: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ comment: comment }, `/api/v1/discussions/update/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
}

export default new DiscussionsSerivice();
