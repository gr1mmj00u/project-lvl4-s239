import { tag as Tag } from '../models';

const createUniqTag = async (values, condition) => {
  const tag = await Tag.findOne({ where: condition });
  if (tag) {
    return tag;
  }
  const newTag = Tag.create(values);

  return newTag;
};

export const getOptionsArray = (tags = []) =>
  tags.map(tag => ({ id: tag.id, name: tag.name }));

export const parseToTags = (str = '') => str.split(',').map(t => t.trim()).filter(t => t);

export const createUniqTags = async (tags = []) => {
  const tagsPromises = tags.reduce(
    (acc, e) =>
      [...acc,
        createUniqTag({ name: e }, { name: e }),
      ],
    [],
  );

  return Promise.all(tagsPromises);
};

export default { getOptionsArray };

