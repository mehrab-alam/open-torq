import { DiscussionNotification } from "@/types/notification";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";

const PostQueryView = (info: DiscussionNotification) => {
  return {
    message: (
      <Flex justify="space-between">
        <Avatar
          style={{ border: "2px solid var(--bg-segment)", width: 40, height: 40 }}
          src={info.subject.image}
          icon={<UserOutlined size={25} />}
          alt="Profile"
        />
        <div style={{ maxWidth: "80%" }}>
          <span style={{ color: "var(--font-primary" }}>{info.subject.name}</span> posted a query in -
          <span style={{ color: "var(--font-primary" }}>{info.object.name}</span>
        </div>
      </Flex>
    ),
    description: (
      <>
        {info.activity ? (
          <div style={{ padding: 10, borderRadius: 4, backgroundColor: "var(--bg-secondary)" }}>
            <p style={{ textAlign: "left" }}>{info.activity}</p>
          </div>
        ) : (
          <></>
        )}
      </>
    ),
    targetLink: info.targetLink,
  };
};

export default PostQueryView;
