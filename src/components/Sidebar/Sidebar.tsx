import React, { FC, useState } from "react";
import styles from "../../styles/Sidebar.module.scss";

import { Avatar, Badge, Button, Dropdown, Layout, Menu, MenuProps, Modal, Space, message } from "antd";

import { DashOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { IResponse, getFetch } from "@/services/request";
import NotificationService from "@/services/NotificationService";

const { Sider } = Layout;

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const [isNewNotifi, setNewNotifi] = React.useState(false);

  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotificationLength, setNotificationLength] = useState<number>(0);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const [modal, contextWrapper] = Modal.useModal();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const getNewNotification = async (userId: number) => {
  //   try {
  //     NotificationService.checkNotification(
  //       userId,
  //       (result) => {
  //         console.log(result, "side");
  //         setNewNotifi(result.isNew);
  //         setNotificationLength(result.length);
  //       },
  //       (error) => {
  //         message.error(error);
  //       }
  //     );
  //   } catch (err: any) {
  //     message.error(err);
  //   }
  // };

  const siderMenu: MenuProps["items"] = [
    {
      type: "group",
      label: "LEARN",
      key: "group1",
    },
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: SvgIcons.dashboard,
    },
    {
      label: <Link href="/courses">Courses</Link>,
      key: "courses",
      icon: SvgIcons.courses,
    },
    {
      label: <Link href="/guides">Guides</Link>,
      key: "guides",
      icon: SvgIcons.guides,
    },
    {
      label: <Link href="/quizzes">Quizzes</Link>,
      key: "quiz",
      icon: SvgIcons.quiz,
    },
    {
      type: "group",
      label: "ACCOUNT",
      key: "group",
    },
    {
      label: <Link href="/setting">Setting</Link>,
      key: "setting",
      icon: SvgIcons.setting,
    },
    {
      label: <Link href="/torq/notifications">Notifications</Link>,
      key: "notification",
      icon: (
        <Badge
          color="blue"
          count={globalState?.notifications?.length}
          style={{ fontSize: 10, paddingTop: 1.5 }}
          size="small"
        >
          {SvgIcons.nottification}
        </Badge>
      ),
    },
    {
      type: "group",
      label: "ADMINISTRATION",
      key: "administration",
    },
    {
      label: <Link href="/admin/users">Users</Link>,
      key: "users",
      icon: SvgIcons.userGroup,
    },
    {
      label: <Link href="/admin/content">Content</Link>,
      key: "content",
      icon: SvgIcons.content,
    },
    {
      label: <Link href="/admin/config">Configurations</Link>,

      key: "configuration",
      icon: SvgIcons.configuration,
    },
  ];

  // React.useEffect(() => {
  //   if (user?.id) {
  //     getNewNotification(user.id);
  //   }
  // }, [user?.id]);

  return (
    <Sider
      width={260}
      theme="light"
      className={`${styles.main_sider} main_sider`}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div
        className={`${styles.collapsed_btn} ${collapsed ? styles.collapsed : styles.not_collapsed}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? SvgIcons.carretRight : SvgIcons.carretLeft}
      </div>
      {contextWrapper}
      <div>
        <div className={styles.logo}>
          <Link href="/programs">
            {collapsed ? (
              <Image src="/icon/torq-logo.svg" alt="torq" width={40} height={30} />
            ) : (
              <Image src="/icon/torq-long-logo.svg" alt="torq" width={130} height={30} />
            )}
          </Link>
        </div>
        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[globalState.selectedSiderMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={siderMenu}
        />
      </div>
      <Space
        direction={collapsed ? "vertical" : "horizontal"}
        align={collapsed ? "center" : "start"}
        className={styles.user_profile}
      >
        <Space>
          <Avatar icon={<UserOutlined />} />
          {!collapsed && (
            <div>
              <h4>{user?.user?.name}</h4>
              <h5>{user?.user?.email}</h5>
            </div>
          )}
        </Space>
        {!collapsed && (
          <Dropdown
            menu={{
              items: [
                {
                  key: "0",
                  label: <Link href={`/setting`}>Setting</Link>,
                },
                {
                  key: "1",
                  label: "Logout",
                  onClick: () => {
                    signOut();
                  },
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        )}
      </Space>
    </Sider>
  );
};

export default Sidebar;
