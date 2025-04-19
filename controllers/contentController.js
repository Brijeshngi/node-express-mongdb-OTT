import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import { Content } from "../models/Content.js";

// createContent
export const createContent = catchAsyncError(
  async (request, response, next) => {
    const {
      contentTitle,
      description,
      releaseDate,
      cast,
      contentType,
      subscriptionPlan,
    } = request.body;

    if (
      !contentTitle ||
      !description ||
      !releaseDate ||
      !cast ||
      !contentType ||
      !subscriptionPlan
    )
      return next(new ErrorHandle("Please provide content name", 401));

    const content = await Content.create({
      contentTitle,
      contentTitle,
      description,
      releaseDate,
      cast,
      contentType,
      subscriptionPlan,
    });

    response.status(200).json({
      success: true,
      message: "Content created successfully",
      content,
    });
  }
);

// updateContent
export const uploadContentFile = catchAsyncError(
  async (request, response, next) => {
    const file = request.file;
    if (!file) return next(new ErrorHandle("No image found", 404));

    // AWS S3 credentials

    const S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = process.env.S3_BUCKET_NAME;
    const fileName = `${Date.now()}-${request.file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make file publicly accessible
    };

    await S3.send(new PutObjectCommand(params));
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    let content = await Content.findById(id);
    content.contentFile = {
      url: fileUrl,
    };
    await content.save();
    response
      .status(200)
      .json({ message: "File uploaded successfully", content });
  }
);

// getallContent

export const getAllContent = catchAsyncError(
  async (request, response, next) => {}
);
// getContentByID
// updatecontent
// deletecontent
// streamContent Description: Validate subscription and return CloudFront URL for streaming.
// listContentsWithPagination
// searchContentTitle
// searchContentByCast
// watchTime
// Views=>first sumbit views on content when API gets a hit then count
// popularContentsBasedOnReviewsAndRatings
// Analytics Description: Fetch streaming statistics, watch counts, and popular content.
// contentDetails Description: Fetch content details with access validation.
// streamVideo Description: Validate subscription and generate a signed CloudFront URL for secure streaming.
// POST /api/admin/content/translate/:id → Uses AWS Translate to auto-generate subtitles in different languages.
// POST /api/admin/content/bulk-upload → Upload multiple contents via CSV.

// Dynamic Bitrate Adjustment (Adaptive Streaming)
// GET /api/user/stream/:id?quality=1080p
// Uses HLS & DASH streaming to dynamically adjust quality based on network speed.

// subscription based access Users can only access content within their plan (e.g., Basic users can’t watch Premium content).

// resume watching GET /api/user/watch-history/:contentId
// Retrieves last watched position to resume playback.

// GET /api/admin/analytics/heatmap → Generates heatmaps to visualize which parts of videos users watch the most.

//
// Watch Party (Real-Time)

//     POST /api/user/watch-party/create → Creates a watch party for group viewing.
//     POST /api/user/watch-party/join/:partyId → Join a watch party session.

//
//
// ### **4. Secure Streaming & DRM (AWS CloudFront, DRM Integration)**
// - DRM prevents unauthorized downloads.
// - If downloaded, content is encrypted and can only be played in authenticated runtime.
// - Quality adapts dynamically based on subscription and network speed.

// - Subscription plans control content quality and access.
// - Ads are displayed for free-tier users.

// GET /api/user/content/available?country=IN → Fetches content available in a user’s country.

// GET /api/user/live-stream/join/:eventId → Join a live event with real-time chat support.

// ### **File Management & Media APIs**
// 91. How to upload and store media files using AWS S3 or Cloudinary?
// 92. How to generate signed URLs for secure media access?
// 93. How to implement video streaming APIs with chunked uploads?
// 94. How to store and retrieve media metadata efficiently?
// 95. How to convert and optimize video formats for different devices?
// 96. How to implement media content access restrictions based on user subscriptions?
// 97. How to handle large file uploads efficiently?
// 98. How to enable DRM (Digital Rights Management) for premium content?
// 99. How to generate media previews for uploaded content?
// 100. How to automate media file deletion after expiration?
// 101. Implement caching in this project like Redis, in-memory and AWS services
