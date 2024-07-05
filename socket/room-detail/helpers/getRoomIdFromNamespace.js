const getRoomIdFromNamespace = (namespace) => {
  const namespacePath = namespace.name;
  const roomId = namespacePath.split("/")[2]; // URL 경로가 '/rooms/{roomId}' 형태일 것이므로

  return roomId;
};

export default getRoomIdFromNamespace;
