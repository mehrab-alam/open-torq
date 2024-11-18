import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Layout, Menu, MenuProps } from "antd";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { CloseOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const LessonListSideBar: FC<{
  menu: MenuProps["items"];
  defaulSelectedKey: string;
}> = ({ menu, defaulSelectedKey }) => {
  const { globalState, dispatch } = useAppContext();
  return (
    <>
      <div
        className={`${styles.lesson_collapsed_btn} ${
          globalState.lessonCollapsed ? styles.lesson_collapsed : styles.lesson_not_collapsed
        }`}
        onClick={() => {
          dispatch({ type: "SET_LESSON_COLLAPSED", payload: !globalState.lessonCollapsed });

          localStorage.setItem("lessonCollapsed", globalState.lessonCollapsed ? "uncollapsed" : "collapsed");
        }}
      >
        <i> {!globalState.lessonCollapsed ? <CloseOutlined /> : SvgIcons.carretLeft}</i>
      </div>

      <Sider
        width={400}
        style={{ position: "absolute", bottom: 0, right: globalState.lessonCollapsed ? -10 : 0 }}
        theme="light"
        reverseArrow={true}
        className={`${styles.lesson_sider} ${globalState.lessonCollapsed ? "collapsed_lesson_sider" : "lesson_sider"}`}
        trigger={null}
        collapsible={false}
      >
        <div className={styles.course_title}>
          <h2>Course Content</h2>
        </div>

        <Menu
          mode="inline"
          onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
          defaultSelectedKeys={[defaulSelectedKey]}
          selectedKeys={[defaulSelectedKey]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={menu}
        />
      </Sider>
    </>
  );
};

export default LessonListSideBar;