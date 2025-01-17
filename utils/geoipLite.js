import geoiplite from "geoip-lite";

export const geoLocation = (ip) => {
  
  const geo = geoiplite.lookup(ip);
  
  return {
    city: geo.city,
    region: geo.region,
    country: geo.country,
    timezone: geo.timezone,
  };
};

export const getOSFromUserAgent = (userAgent) => {
  const userAgentLower = userAgent.toLowerCase();
  const windows = /windows/i.test(userAgentLower);
  const macos = /macintosh/i.test(userAgentLower);
  const android = /android/i.test(userAgentLower);
  if (windows) {
    return "Windows";
  } else if (macos) {
    return "MacOS";
  } else if (android) {
    return "Android";
  } else {
    return "Other";
  }
};

export const getDeviceFromUserAgent = (userAgent) => {
  const userAgentLower = userAgent.toLowerCase();
  const mobile = /mobile/i.test(userAgentLower);
  if (mobile) {
    return "Mobile";
  } else {
    return "Desktop";
  }
};
