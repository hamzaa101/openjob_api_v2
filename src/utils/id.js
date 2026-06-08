const createId = (prefix) => {
  const randomString = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();

  return `${prefix}-${timestamp}-${randomString}`;
};

module.exports = createId;