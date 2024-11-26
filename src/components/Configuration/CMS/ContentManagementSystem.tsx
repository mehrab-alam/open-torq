import { Button, Flex, Form, Input, message, Select, Steps, Tag, Upload } from "antd";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ContentConfigForm from "@/components/Configuration/CMS/ContentConfigForm";
import { ReactNode, useState } from "react";
import cmsClient from "@/lib/admin/cms/cmsClient";
import styles from "./CMS.module.scss";
import FormDisableOverlay from "../FormDisableOverlay";
import SvgIcons from "@/components/SvgIcons";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import cmsConstant from "@/lib/admin/cms/cmsConstant";

export interface ICmsForm {
  title: string;
  description: string;
  input: ReactNode;
  inputName: string;
  optional?: boolean;
  divider?: boolean;
}

const ContentManagementSystem = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [accessKeyForm] = Form.useForm();
  const [waterMarkUrl, setIWaterMarkUrl] = useState<string | null>(null);
  const [replicationRegions, setRegions] = useState<{ name: string; code: string }[]>([]);
  const [videoForm] = Form.useForm();
  const [cdnForm] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(0);

  const handleChange = (info: any) => {
    if (info.fileList.length > 1) {
      return;
    }
    const file = info.fileList[0].originFileObj;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIWaterMarkUrl(reader.result as string); // Convert to Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const videoItems = [
    {
      title: "Choose Replication Regions",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      optional: false,

      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Choose replication regions"
        >
          {replicationRegions.map((region, i) => {
            return (
              <Select.Option key={i} value={`${region.code}`}>
                {region.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "replicationRegion",
    },

    {
      title: "Allowed Domain names",
      optional: true,

      description:
        "The list of domains that are allowed to access the videos. If no hostnames are listed all requests will be allowed.",
      input: (
        <Select mode="tags" suffixIcon={<></>} placeholder="Add domain names" open={false} style={{ width: 250 }} />
      ),
      inputName: "domainNames",
    },
    {
      title: "Upload Watermark",
      optional: true,

      description:
        "Automatically watermark uploaded videos. The watermark is encoded into the video itself and cannot be removed after encoding.",
      input: (
        <ImgCrop rotationSlider aspect={1 / 1}>
          <Upload
            accept="image/*"
            listType="picture-card"
            showUploadList={false}
            name="avatar"
            maxCount={1}
            className={styles.upload__watermark}
            multiple={false}
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleChange}
          >
            {waterMarkUrl ? (
              <div className={styles.img__preview}>
                <Image src={waterMarkUrl} height={100} width={100} alt="water mark" />
                <div className={styles.icon}>
                  <i>{SvgIcons.camera}</i>
                </div>
              </div>
            ) : (
              <Flex vertical>
                <i>{SvgIcons.camera}</i>
                upload
              </Flex>
            )}
          </Upload>
        </ImgCrop>
      ),
      inputName: "waterMark",
    },
    {
      title: "Set Resolutions",
      optional: false,

      description:
        "Select te enabled resolutions that will be encoded. Only resolutions smaller than or equal to the original video resolutions will be used during encoding.",
      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Select resolutions"
        >
          {cmsConstant.videoResolutions.map((resolution, i) => {
            return (
              <Select.Option key={i} value={`${resolution.value}`}>
                {resolution.label}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "resolution",
    },
  ];

  const cdnItems: ICmsForm[] = [
    {
      title: "Main Storage Region",
      description:
        "Give a name to the storage zone that will be storing all the static images for courses, events and users",
      input: <Input placeholder="Add main storage name" />,

      inputName: "mainStorageName",
    },
    {
      title: "Choose Replication Regions",
      description: "Choose regions from where the video will be accessed and streamed to the users",
      input: (
        <Select
          labelInValue
          optionLabelProp="label"
          style={{ width: 250 }}
          mode="tags"
          placeholder="Choose replication regions"
        >
          {replicationRegions.map((region, i) => {
            return (
              <Select.Option key={i} value={`${region.code}`}>
                {region.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
      inputName: "replicationRegion",
    },
    {
      title: "Custom Domain",
      description: "Use a custom domain that will be used to access images",
      input: <Input placeholder="Add custom domain" />,
      inputName: "domainNames",
      optional: true,
    },

    {
      title: "Allowed hostnames",
      optional: true,

      description:
        "The list of hostnames that are allowed to access the images. If no hostnames are listed all requests will be allowed.",
      input: <Select mode="tags" suffixIcon={<></>} placeholder="Add hostnames" open={false} style={{ width: 250 }} />,
      inputName: "hostNames",
    },
  ];

  const listRegions = () => {
    try {
      setLoading(true);
      cmsClient.listReplicationRegions(
        "ACCESS_KEY",
        "bunny.net",
        (result) => {
          setCurrent(1);
          setRegions(result.regions);

          setLoading(false);
        },
        (error) => {
          setCurrent(0);
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      setCurrent(0);
      messageApi.error(error as string);
      setLoading(false);
    }
  };

  const onTestAccessKey = () => {
    try {
      setLoading(true);
      cmsClient.testAccessKey(
        accessKeyForm.getFieldsValue().accessKey,
        "bunny.net",
        (result) => {
          listRegions();
          // setCurrent(1);
          messageApi.success(result.message);
          // setLoading(false);
        },
        (error) => {
          setCurrent(0);
          messageApi.error(error);
          setLoading(false);
        }
      );
    } catch (error) {
      setCurrent(0);
      messageApi.error(error as string);
      setLoading(false);
    }
  };

  const onSubmitVideoInfo = () => {
    let data = {
      ...videoForm.getFieldsValue(),
      replicationRegion: videoForm.getFieldsValue().replicationRegion.map((r: any) => r.value),
      resolution: videoForm.getFieldsValue().resolution.map((r: any) => r.value),
    };
  };

  return (
    <section>
      {contextHolder}
      <h3>Content Management System</h3>

      <Steps
        current={current}
        status="finish"
        size="small"
        progressDot
        direction="vertical"
        items={[
          {
            title: (
              <ConfigFormLayout
                formTitle={"Configure Bunny.net"}
                extraContent={
                  <Flex align="center" gap={10}>
                    {<Button onClick={() => accessKeyForm.resetFields()}>Reset</Button>}

                    <Button loading={loading} onClick={() => accessKeyForm.submit()} type="primary">
                      Connect
                    </Button>
                  </Flex>
                }
              >
                <Form form={accessKeyForm} onFinish={onTestAccessKey} requiredMark={false}>
                  <ContentConfigForm
                    input={
                      <Form.Item
                        style={{ width: 250 }}
                        name={"accessKey"}
                        rules={[{ required: true, message: "Access key is required!" }]}
                      >
                        <Input.Password placeholder="Add access key" />
                      </Form.Item>
                    }
                    title={"Bunny.net Access Key"}
                    description={
                      "Provide access key for Bunny.net that will be used to configure video stream, image CDN and file storage"
                    }
                    divider={false}
                    inputName={""}
                  />
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <ConfigFormLayout
                extraContent={
                  <Flex align="center" gap={10}>
                    {<Button onClick={() => videoForm.resetFields()}>Reset</Button>}

                    <Button onClick={() => videoForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Video On Demand"}
              >
                <Form form={videoForm} onFinish={onSubmitVideoInfo} requiredMark={false}>
                  {videoItems.map((item, i) => {
                    return (
                      <ContentConfigForm
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
                        divider={i === videoItems.length - 1 ? false : true}
                        inputName={""}
                        optional={item.optional}
                      />
                    );
                  })}
                  {current < 1 && <FormDisableOverlay />}
                </Form>
              </ConfigFormLayout>
            ),
          },
          {
            title: (
              <ConfigFormLayout
                extraContent={
                  <Flex align="center" gap={10}>
                    {<Button onClick={() => cdnForm.resetFields()}>Reset</Button>}

                    <Button onClick={() => cdnForm.submit()} type="primary">
                      Save
                    </Button>
                  </Flex>
                }
                formTitle={"Content Delivery Network-Images"}
              >
                <Form form={cdnForm}>
                  {cdnItems.map((item, i) => {
                    return (
                      <ContentConfigForm
                        input={
                          <Form.Item
                            rules={[{ required: !item.optional, message: `Field is required!` }]}
                            name={item.inputName}
                            key={i}
                          >
                            {item.input}
                          </Form.Item>
                        }
                        title={item.title}
                        description={item.description}
                        divider={i === cdnItems.length - 1 ? false : true}
                        optional={item.optional}
                        inputName={""}
                      />
                    );
                  })}
                  {/* {current < 2 && <FormDisableOverlay />} */}
                </Form>
              </ConfigFormLayout>
            ),
          },
        ]}
      />
    </section>
  );
};

export default ContentManagementSystem;
