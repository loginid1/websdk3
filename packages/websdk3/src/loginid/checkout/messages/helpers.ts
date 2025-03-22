// Copyright (C) LoginID

import { MESSAGES_CHANNEL } from "./constants";

/**
 * Verifies if a message event is from the expected origin and channel.
 *
 * @param {MessageEvent} event - The message event to verify.
 * @param {string} origin - The expected origin of the message.
 * @returns {boolean} True if the message is from the expected origin and channel, false otherwise.
 */
export const verifyMessage = (event: MessageEvent, origin: string): boolean => {
  if (event.origin !== origin) return false;

  const data = event.data;
  if (!data) return false;
  if (data.channel !== MESSAGES_CHANNEL) return false;

  return true;
};
