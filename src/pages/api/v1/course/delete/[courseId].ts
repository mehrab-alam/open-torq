import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import url from "url";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
    });

    if (findCourse) {
      const result: any =
        await prisma.$queryRaw`SELECT COUNT(r.resourceId) > 0 AS resourceCount FROM Resource r JOIN Chapter c ON c.chapterId = r.chapterId
      JOIN Course co ON c.courseId = co.courseId WHERE co.courseId = ${Number(courseId)}`;
      const totalCount = Number(result[0].resourceCount);
      if (totalCount > 0) {
        return res.status(400).json({
          info: false,
          success: false,
          error: "You need to delete the existing lessons, before deleting the course",
        });
      } else {
        const parseUrl = findCourse.thumbnail && url.parse(findCourse.thumbnail);
        const filePath = parseUrl && parseUrl.pathname;
        const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
          where: {
            service_type: "media",
          },
        });
        const cms = new ContentManagementService();
        const serviceProvider =
          serviceProviderResponse &&
          cms.getServiceProvider(serviceProviderResponse?.provider_name, serviceProviderResponse?.providerDetail);
        if (serviceProviderResponse && findCourse.tvProviderId && serviceProvider) {
          const deletionResponse = await cms.deleteVideo(
            findCourse.tvProviderId,
            Number(courseId),
            "course",
            serviceProvider
          );
          if (!deletionResponse.success) {
            throw new Error(`Unable to delete the video due to : ${deletionResponse.message}`);
          }
        }
        if (findCourse.thumbnail && serviceProvider) {
          const deletionBannerResponse = await cms.deleteFile(`${filePath}`, serviceProvider);
          if (!deletionBannerResponse.success) {
            throw new Error(`Unable to delete the file due to : ${deletionBannerResponse.message}`);
          }
        }
        const courseDeleted = await prisma.course.delete({
          where: {
            courseId: Number(courseId),
          },
        });
        return res.status(200).json({
          info: false,
          success: true,
          message: "Course has been deleted.",
        });
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));
