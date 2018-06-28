export const getOptionsArray = (tags = []) =>
  tags.map(tag => ({ id: tag.id, name: tag.name }));

export default { getOptionsArray };
