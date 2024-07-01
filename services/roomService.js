import roomRepository from "../repositories/roomRepository.js";

const roomService = {
  async getRooms({ connection, page, limit }) {
    const offset = (page - 1) * limit;
    const { data, totalElements } = await roomRepository.findAllRooms({
      connection,
      offset,
      limit,
    });

    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalElements / limit),
        totalElements,
        limit: parseInt(page),
      },
    };
  },
};

export default roomService;
