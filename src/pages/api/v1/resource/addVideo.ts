import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { ResourceContentType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { id, videoDuration, videoUrl, thumbnail, state, mediaProvider, videoId } = body;

    // CHECK IS RESOURCE EXIST WITH THIS NAME

    const addVideo = await prisma.video.create({
      data: {
        resourceId: id,
        videoDuration: videoDuration,
        videoUrl: videoUrl,
        providerVideoId: videoId,
        thumbnail: thumbnail,
        state: state,
        mediaProvider: mediaProvider,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Resource added successfully",
      resource: addVideo,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
