// Copyright (C) LoginID

const getOriginFromUrl = (rawUrl: string) => {
  try {
    return new URL(rawUrl).origin;
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
};

export { getOriginFromUrl };
