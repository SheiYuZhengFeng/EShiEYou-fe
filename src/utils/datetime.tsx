export const durationToTime = (d: number) => {
  let h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
  let t = "";
  if (m < 10) t = "0" + m;
  else t = m.toString();
  if (s < 10) t = t + ":0" + s;
  else t = t + ":" + s;
  if (h > 0) t = h + ":" + t;
  return t;
}

export const unixToString = (unix: number) => {
  return new Date(unix * 1000).toLocaleString();
}

export const getCurrentUnix = () => {
  return new Date().getTime() / 1000;
}
