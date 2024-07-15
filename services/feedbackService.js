import feedbackRepository from "../repositories/feedbackRepository.js";

const feedbackService = {
  async createFeedback({ connection, contents }) {
    await feedbackRepository.createFeedback({ connection, contents });
  },
};

export default feedbackService;
