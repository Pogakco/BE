import roomListRepository from "../repositories/roomListRepository.js";

const roomListService = {
  async getRooms({ connection, page, limit, isRunning, userId }) {
    const offset = (page - 1) * limit;
    const { data, totalElements } = await roomListRepository.findRooms({
      connection,
      offset,
      limit,
      isRunning,
      userId,
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