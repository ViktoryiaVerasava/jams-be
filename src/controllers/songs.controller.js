import model from '../models';
import formatError from '../utils/formatError.util';

const { Song, Jam } = model;

const findAll = async (_, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: Jam,
          attributes: ['id'],
        },
      ],
    });
    res.send({ data: songs });
  } catch (e) {
    return res
      .status(500)
      .send({ message: formatError(e, 'Error retrieving songs') });
  }
};

export { findAll };
