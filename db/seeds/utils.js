export const formatDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

export const formatComments = (comments, idLookup) => {
  return comments.map(
    ({ created_by, belongs_to, created_at, ...restOfComment }) => {
      const article_id = idLookup[belongs_to];
      return {
        article_id,
        author: created_by,
        created_at: new Date(created_at),
        ...restOfComment,
      };
    },
  );
};
