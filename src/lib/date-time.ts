import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone"; // ES 2015
import utc from "dayjs/plugin/utc"; // ES 2015

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const formatDate = (value?: string | Date) => {
  if (!value) return "";
  if (!dayjs(value).isValid()) return "";

  return dayjs(value).format("LLL");
};
