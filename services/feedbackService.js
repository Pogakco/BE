import feedbackRepository from "../repositories/feedbackRepository.js";

const feedbackService = {
  async createFeedback({ connection, contents }) {
    await feedbackRepository.addFeedback({ connection, contents });
  },
};

export default feedbackService;
