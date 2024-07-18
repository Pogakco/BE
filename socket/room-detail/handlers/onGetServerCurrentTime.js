import dayjs from "dayjs";
import { TIMESTAMP_FORMAT } from "../../../constants.js";

const onGetServerCurrentTime = (socket, callback) => {
  const serverCurrentTime = dayjs().format(TIMESTAMP_FORMAT);
  
  callback({ serverCurrentTime });
};

export default onGetServerCurrentTime;
