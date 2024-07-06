import roomListRepository from "../repositories/roomListRepository.js";

const roomListService = {
  async getRooms({ connection, page, limit, isRunning }) {
    const offset = (page - 1) * limit;
    const { data, totalElements } = await roomListRepository.findAllRooms({
      connection,
      offset,
      limit,
      isRunning,
    });

    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalElements / limit),
        totalElements,
        limit: parseInt(limit),
      },
    };
  },

  async getMyRooms({ connection, userId, page, limit, isRunning }) {
    const offset = (page - 1) * limit;
    const { data, totalElements } = await roomListRepository.findMyRooms({
      connection,
      userId,
      offset,
      limit,
      isRunning,
    });

    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalElements / limit),
        totalElements,
        limit: parseInt(limit),
      },
    };
  },
};

export default roomListService;
