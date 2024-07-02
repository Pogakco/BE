import roomListRepository from "../repositories/roomListRepository.js";

const roomListService = {
  async getRooms({ connection, page, limit, is_running }) {
    const offset = (page - 1) * limit;
    const { data, totalElements } = await roomListRepository.findAllRooms({
      connection,
      offset,
      limit,
      is_running,
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
