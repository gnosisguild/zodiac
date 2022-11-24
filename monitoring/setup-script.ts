import {
  setupSentinelClient,
  NotificationType,
  setupNewNotificationChannel,
  createSentinel,
  createAutotask,
  setupAutotaskClient,
} from "./defender";

import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OZ_DEFENDER_API_KEY;
if (API_KEY == null) {
  throw new Error("API_KEY is not defined");
}
const API_SECRET = process.env.OZ_DEFENDER_API_SECRET;
if (API_SECRET == null) {
  throw new Error("API_SECRET is not defined");
}
const DISCORD_URL_WITH_KEY = process.env.DISCORD_URL_WITH_KEY;
if (DISCORD_URL_WITH_KEY == null) {
  throw new Error("DISCORD_URL_WITH_KEY is not defined");
}

const setup = async () => {
  try {
    const sentinelClient = setupSentinelClient({
      apiKey: API_KEY,
      apiSecret: API_SECRET,
    });
    console.log("Client is ready");

    const notificationChannel = {
      channel: "discord",
      config: {
        url: DISCORD_URL_WITH_KEY,
      },
    };

    const notificationChannelId = await setupNewNotificationChannel(
      sentinelClient,
      notificationChannel.channel,
      notificationChannel.config
    );

    const sentinelCreationResponds = await createSentinel(
      sentinelClient,
      [notificationChannelId],
      "mainnet",
      realityModuleAddress,
      autotaskId
    );
    console.log("Sentinel creation responds", sentinelCreationResponds);
    return response
      .status(200)
      .setHeader("content-type", "application/json;charset=UTF-8")
      .setHeader("Access-Control-Allow-Origin", "*")
      .send({
        success: true,
      });
  } catch (e) {
    console.error(e);

    const { name, message } = e;
    // this is safe for we are requesting on behalf of the user (with their API key)
    return response.status(500).send({
      name,
      message,
      success: false,
    });
  }
};
