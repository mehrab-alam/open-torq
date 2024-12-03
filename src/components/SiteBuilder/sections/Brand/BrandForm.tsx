import { FC, useEffect, useState } from "react";
import styles from "./BrandForm.module.scss";
import { Button, ColorPicker, Divider, Flex, Form, FormInstance, Input, Upload } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { UploadOutlined } from "@ant-design/icons";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { IBrandConfig } from "@/types/schema";

const BrandForm: FC<{
  config: PageSiteConfig;
  form: FormInstance;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ form, updateSiteConfig, config }) => {
  const [brandConfig, setBrandConfig] = useState<IBrandConfig | undefined>(config.brand);

  const onUpdateBrandConfig = (value: string, key: string) => {
    if (key.startsWith("socialLinks")) {
      const linkKey = key.split(".")[1];
      setBrandConfig({ ...brandConfig, socialLinks: { ...brandConfig?.socialLinks, [linkKey]: value } });
    } else {
      setBrandConfig({ ...brandConfig, [key]: value });
    }
  };

  useEffect(() => {
    updateSiteConfig({ ...config, brand: brandConfig });
  }, [brandConfig]);
  const brandItems: IConfigForm[] = [
    {
      title: "Brand name",
      description: "Add a brand name for your site ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "name");
          }}
          placeholder="Add brand name"
        />
      ),
      inputName: "name",
    },
    {
      title: "Site title",
      description: "Add a title for your site ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "title");
          }}
          placeholder="Add title"
        />
      ),
      inputName: "title",
    },
    {
      title: "Site description",
      description: "Choose regions from where ",
      layout: "vertical",
      input: (
        <Input
          onChange={(e) => {
            onUpdateBrandConfig(e.currentTarget.value, "description");
          }}
          placeholder="Add description"
        />
      ),
      inputName: "description",
    },
    {
      title: "Accent color",
      layout: "vertical",

      description: "Primary color used in your theme",
      input: (
        <ColorPicker
          onChange={(e) => {
            onUpdateBrandConfig(e.toHexString(), "brandColor");
          }}
          className={styles.form__color__picker}
          defaultValue={DEFAULT_THEME.brand.brandColor}
          disabledAlpha
        />
      ),
      inputName: "brandColor",
    },

    {
      title: "Brand icon",

      description: "A square social icon at least 60 x 60.",
      layout: "vertical",

      input: (
        <Upload>
          <Button icon={<UploadOutlined />} style={{ width: 60, height: 60 }}></Button>
        </Upload>
      ),
      inputName: "icon",
    },
    {
      title: "Brand logo",
      layout: "vertical",

      description: "The primary logo should be transparent and at least 600 x 72px.",
      input: (
        <Upload>
          <Button icon={<UploadOutlined />} style={{ width: 100 }}>
            Logo
          </Button>
        </Upload>
      ),
      inputName: "logo",
    },

    {
      title: "Social links",

      description: "Add social links ",
      layout: "vertical",
      input: (
        <Flex vertical gap={10}>
          <Input
            addonBefore="https://"
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(e.currentTarget.value, "socialLinks.discord");
            }}
            placeholder="Discord link"
          />
          <Input
            addonBefore="https://"
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(e.currentTarget.value, "socialLinks.github");
            }}
            placeholder="Github link"
          />
          <Input
            addonBefore="https://"
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(e.currentTarget.value, "socialLinks.youtube");
            }}
            placeholder="Youtube link"
          />

          <Input
            addonBefore="https://"
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(e.currentTarget.value, "socialLinks.instagram");
            }}
            placeholder="Instagram link"
          />
          <Input
            addonBefore="https://"
            type="url"
            onChange={(e) => {
              onUpdateBrandConfig(e.currentTarget.value, "socialLinks.twitter");
            }}
            placeholder="Twitter link"
          />
        </Flex>
      ),
      inputName: "social",
    },
  ];
  return (
    <div className={styles.brand__wrapper}>
      <Form
        form={form}
        requiredMark={false}
        initialValues={{
          brandColor: config.brand?.brandColor,
          name: config.brand?.name,
          title: config.brand?.title,
          description: config.brand?.description,
        }}
      >
        {brandItems.map((item, i) => {
          return (
            <>
              <ConfigForm
                input={
                  <Form.Item
                    name={item.inputName}
                    rules={[{ required: !item.optional, message: `Field is required!` }]}
                    key={i}
                  >
                    {item.input}
                  </Form.Item>
                }
                title={item.title}
                description={item.description}
                layout={item.layout}
                divider={i === brandItems.length - 1 ? false : true}
                inputName={""}
                optional={item.optional}
              />
              {brandItems.length !== i + 1 && <Divider style={{ margin: "0px 0px 15px 0px" }} />}
            </>
          );
        })}
      </Form>
    </div>
  );
};

export default BrandForm;
