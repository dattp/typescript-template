import Bull from "bull";
import { setQueues, BullAdapter } from "bull-board";

import { QUEUENAME } from "../constants/queue.constants";

import { UserProcessQueue } from "../user/controllers/user.process.queue";
export const createMailRegisterQueue = new Bull(QUEUENAME.MAIL_REGISTER, {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10) || 6379,
  },
});

createMailRegisterQueue.process(5, UserProcessQueue.verifyMail);

setQueues([new BullAdapter(createMailRegisterQueue)]);
