import feedbackRepository from "../repositories/feedbackRepository.js";

const feedbackService = {
  async postFeedback({ connection, contents }) {
    await feedbackRepository.addFeedback({ connection, contents });
  },
};

export default feedbackService;
