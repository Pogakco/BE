const feedbackRepository = {
  async createFeedback({ connection, contents }) {
    const SQL = "INSERT INTO `feedbacks` (`contents`) VALUES (?);";

    await connection.query(SQL, [contents]);
  },
};

export default feedbackRepository;
