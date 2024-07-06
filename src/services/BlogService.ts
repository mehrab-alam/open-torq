import { Blog, StateType } from "@prisma/client";
import { getDelete, getFetch, postFetch } from "./request";
import { title } from "process";
import { JSONContent } from "@tiptap/react";
export interface latestBlogs extends Blog {
  user: {
    name: string;
  };
}
export type UserAnalyseData = {
  year: any;
  month: any;
  users: number;
};
export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
  latestBlogs: latestBlogs[];
  blog: Blog;
};

type FailedApiResponse = {
  error: string;
};
class BlogService {
  createBlog = (type: string, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    postFetch({ type }, `/api/v1/admin/blog/create`).then((result) => {
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

  updateBlog = (
    title: string | undefined,
    content: JSONContent | undefined,
    state: StateType,
    banner: string | undefined,
    blogId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ title, content, state, banner, blogId }, `/api/v1/admin/blog/update`).then((result) => {
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
  getLatestDraftBlog = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/blog/latestDraftBlog`).then((result) => {
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
  getBlogById = (blogId: string, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/blog/get-blog-by-id?blogId=${blogId}`).then((result) => {
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
  deleteBlog = (blogId: string, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getDelete(`/api/v1/admin/blog/delete?blogId=${blogId}`).then((result) => {
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
  getLatestBlogs = (
    type: string,
    offSet: number,
    limit: number,
    filter: boolean,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(
      filter
        ? `/api/v1/admin/blog/latest-blog?offset=${offSet}&limit=${limit}&filter=${filter}&type=${type}`
        : `/api/v1/admin/blog/latest-blogs?type=${type}`
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
}

export default new BlogService();
