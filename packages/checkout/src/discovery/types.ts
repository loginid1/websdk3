// Copyright (C) LoginID

import { DiscoverResult } from "../types";

/**
 * Interface for defining a strategy to discover user and authentication contexts.
 */
export interface DiscoverStrategy {
  /**
   * Discovers the appropriate checkout context based on the provided encrypted context.
   * @param {string} [username] - An optional username.
   * @returns {Promise<DiscoverResult>} A promise that resolves to the discovered result.
   */
  discover(username?: string): Promise<DiscoverResult>;
}
