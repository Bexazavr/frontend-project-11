import { string } from 'yup';

const schema = string().url().required();

export default (value, feeds) => (
  schema.validate(value)
    .then(() => {
      const isAdded = feeds.includes(value);

      return {
        isValid: !isAdded,
        errorMessage: isAdded ? 'RSS уже существует' : '',
      };
    })
    .catch(() => ({
      isValid: false,
      errorMessage: 'Ссылка должна быть валидным URL',
    }))
);
