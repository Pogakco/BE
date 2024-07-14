const getAllLinkedUserIdsFromNamespace = (namespace) => {
  const linkedSockets = Object.values(Object.fromEntries(namespace.sockets));

  const userIds = linkedSockets
    .map(({ userId }) => userId)
    .filter((userId) => !!userId);

  return [...new Set(userIds)];
};

export default getAllLinkedUserIdsFromNamespace;
