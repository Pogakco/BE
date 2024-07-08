import { query, param, body } from "express-validator";
import createValidator from "./helpers/createValidator.js";

const createIsRunningChain = () => {
  return query("is_running")
    .optional()
    .isBoolean()
    .withMessage("boolean 형식입니다.");
};

const createPageChain = () => {
  return query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page는 1 이상의 정수입니다.");
};

const createLimitChain = () => {
  return query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit는 1 이상의 정수입니다.");
};

const createRoomIdParamChain = () => {
  return param("id").isInt().withMessage("id 값이 잘못되었습니다.");
};

const createRoomTitleChain = () => {
  return body("roomTitle").notEmpty().withMessage("방 제목을 입력해주세요.");
};

const createRoomDescriptionChain = () => {
  return body("roomDescription")
    .notEmpty()
    .withMessage("방 설명을 입력해주세요.");
};

const createFocusTimeChain = () => {
  return body("focusTime")
    .notEmpty()
    .withMessage("집중 시간을 입력해주세요.")
    .bail()
    .isInt({ min: 25, max: 60 })
    .withMessage("집중 시간은 25분에서 60분 사이여야 합니다.");
};

const createShortBreakTimeChain = () => {
  return body("shortBreakTime")
    .notEmpty()
    .withMessage("짧은 휴식 시간을 입력해주세요.")
    .bail()
    .isInt({ min: 5, max: 15 })
    .withMessage("짧은 휴식 시간은 5분에서 15분 사이여야 합니다.");
};

const createLongBreakTimeChain = () => {
  return body("longBreakTime")
    .notEmpty()
    .withMessage("긴 휴식 시간을 입력해주세요.")
    .bail()
    .isInt({ min: 30, max: 60 })
    .withMessage("긴 휴식 시간은 30분에서 60분 사이여야 합니다.");
};

const createTotalCyclesChain = () => {
  return body("totalCycles")
    .notEmpty()
    .withMessage("뽀모도로 싸이클 수를 입력해주세요.")
    .bail()
    .isInt({ min: 1, max: 12 })
    .withMessage("총 사이클 수는 1에서 12사이여야 합니다.");
};

const createMaxParticipantsChain = () => {
  return body("maxParticipants")
    .notEmpty()
    .withMessage("수용 인원 수를 입력해주세요")
    .bail()
    .isInt({ min: 1 })
    .withMessage("수용 인원 수는 최소 1명 이상이어야 합니다.");
};

const roomValidator = {
  getAllRoomsValidator() {
    return createValidator(
      createIsRunningChain,
      createPageChain,
      createLimitChain
    );
  },

  getRoomDetailValidator() {
    return createValidator(createRoomIdParamChain);
  },

  getCreateRoomValidator() {
    return createValidator(
      createRoomTitleChain,
      createRoomDescriptionChain,
      createFocusTimeChain,
      createShortBreakTimeChain,
      createLongBreakTimeChain,
      createTotalCyclesChain,
      createMaxParticipantsChain
    );
  },
};

export default roomValidator;
