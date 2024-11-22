import { FC, useState } from "react";
import styles from "@/components/SiteConfigure/SiteConfigure.module.scss";

import { Button, ColorPicker, Flex, Form, Input, message } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "../SvgIcons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { postFetch } from "@/services/request";
import { useRouter } from "next/router";

const BasicInfo: FC<{ title: string; description: string; siteConfig: PageSiteConfig }> = ({
  title,
  description,
  siteConfig,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<{ brandName?: string; brandColor?: string; brandTitle?: string }>({
    brandColor: siteConfig.brand?.brandColor ? siteConfig?.brand?.brandColor : DEFAULT_THEME.brand.brandColor,
    brandName: siteConfig.brand?.name,
    brandTitle: siteConfig.brand?.title,
  });

  const [messageApi, contexHolder] = message.useMessage();

  const onFinish = async () => {
    setLoading(true);
    const res = await postFetch(
      {
        ...form.getFieldsValue(),
        brandColor:
          typeof form.getFieldsValue().brandColor !== "string"
            ? form.getFieldsValue().brandColor.toHexString()
            : siteConfig.brand?.brandColor,
      },
      "/api/v1/admin/site/basic-info/update"
    );
    if (res.ok) {
      const result = await res.json();

      if (result.success) {
        messageApi.success(result.message);
        setInitialValue(result.basicInfo);
        router.push("/signup");
      } else {
        messageApi.error(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <section className={styles.basic__info__container}>
      {contexHolder}
      <div className={styles.basic__info}>
        <Link href={"/"}>
          <Flex align="center" gap={5}>
            <Image src={`${siteConfig?.brand?.logo}`} height={60} width={60} alt={"logo"} loading="lazy" />
          </Flex>
        </Link>
        <h2>{title}</h2>
        <p>{description}</p>
        <Form
          initialValues={initialValue}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className={styles.form__container}
        >
          <Flex align="center" gap={20} justify="space-between">
            <Form.Item name={"brandName"} label="Brand Name" rules={[{ required: true, message: " add brand name" }]}>
              <Input className={styles.name__input} placeholder="Brand name" />
            </Form.Item>
            <Form.Item
              name={"brandColor"}
              label="Brand Color"
              rules={[{ required: true, message: " add brand color" }]}
            >
              <ColorPicker
                className={`${styles.form__color__picker} basic_info_color_picker`}
                defaultValue={
                  siteConfig?.brand?.brandColor ? siteConfig?.brand?.brandColor : DEFAULT_THEME.brand.brandColor
                }
                disabledAlpha
              />
            </Form.Item>
          </Flex>
          <Form.Item name={"brandTitle"} label="Brand Title" rules={[{ required: true, message: " add brand title" }]}>
            <Input placeholder="Brand Title" />
          </Form.Item>
          <Button loading={loading} htmlType="submit" type="primary">
            Continue <i>{SvgIcons.arrowRight}</i>
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default BasicInfo;
