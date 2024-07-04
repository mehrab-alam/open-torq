import React, { FC, useEffect, useState } from "react";
import { Dropdown, Modal, Table, message } from "antd";
import SvgIcons from "@/components/SvgIcons";

import { useRouter } from "next/router";
import BlogService, { latestBlogs } from "@/services/BlogService";
import appConstant from "@/services/appConstant";
import { StateType } from "@prisma/client";

const BlogList: FC<{}> = () => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const [blogData, setBlogData] = useState<latestBlogs[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, messageHolder] = message.useMessage();

  const handleBlogStatusUpdate = (id: string, state: StateType) => {
    setLoading(true);

    BlogService.updateBlog(
      undefined,
      undefined,
      state,
      undefined,
      id,
      (result) => {
        messageApi.success(result.message);
        setRefresh(!refresh);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  const handleBlogDelete = (id: string) => {
    setLoading(true);
    BlogService.deleteBlog(
      id,
      (result) => {
        messageApi.success(result.message);
        setRefresh(!refresh);
        setLoading(false);
      },
      (error) => {}
    );
  };
  const columns: any = [
    {
      title: "TITLE",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "AUTHOR",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "STATE",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Type",
      align: "center",

      dataIndex: "difficulty",
      key: "difficulty",
    },

    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, courseInfo: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    router.push(`/admin/content/blog/${courseInfo?.id}`);
                  },
                },
                {
                  key: "2",
                  label: courseInfo.state == "DRAFT" ? "Publish" : "Move to Draft",
                  onClick: () => {
                    if (courseInfo.name === "Untitled") {
                      messageApi.warning("Blog is not ready to publish");
                    } else {
                      handleBlogStatusUpdate(String(courseInfo.id), courseInfo.state == "DRAFT" ? "ACTIVE" : "DRAFT");
                    }
                  },
                },

                {
                  key: "3",
                  label: "Delete",
                  onClick: () => {
                    modal.confirm({
                      title: "Are you sure you want to delete the blog?",
                      okText: "Yes",
                      cancelText: "No",
                      onOk: () => {
                        handleBlogDelete(String(courseInfo.id));
                      },
                    });
                  },
                },
              ],
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "key",
    },
  ];

  useEffect(() => {
    setLoading(true);

    BlogService.getLatestBlogs(
      5,
      appConstant.defaultPageSize,
      false,
      (result) => {
        console.log(result, "r");
        setBlogData(result.latestBlogs);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, [refresh]);

  const data = blogData?.map((blog, i) => {
    return {
      key: i + 1,
      name: blog.title,
      author: blog.user?.name,
      state: blog.state,
      id: blog.id,
      difficulty: "N/A",
    };
  });

  return (
    <div>
      {messageHolder}
      <Table size="small" className="users_table" columns={columns} dataSource={data} loading={loading} />
      {contextHolder}
    </div>
  );
};

export default BlogList;
