import model from '../models';
import formatError from '../utils/formatError.util';
import { removeFromArray } from '../utils/removeFromArray.util';

const { Jam, User, JamUsers, Song } = model;

const addUserToJam = async (req, res) => {
  const { userId } = req.body;
  const jamId = req.params.id;
  try {
    let availableInstruments = [];
    const jamToUser = await JamUsers.findAll({
      where: { jamId },
      include: [
        { model: User, attributes: ['instrument'] },
        {
          model: Jam,
          attributes: ['isStarted'],
          include: { model: Song, as: 'song', attributes: ['instruments'] },
        },
      ],
    });
    if (jamToUser.length) {
      const allInstruments = jamToUser[0].Jam.song.instruments;
      const occupiedInstruments = jamToUser.map((j) => j.User.instrument);
      availableInstruments = removeFromArray(
        allInstruments,
        occupiedInstruments
      );
      if (!availableInstruments.length) {
        return res.status(403).send({ message: `All positions are occupied` });
      }
      const involvedUserIds = jamToUser.map((j) => j.User.id);
      if (involvedUserIds.includes(userId)) {
        return res.status(403).send({ message: `You are already involved` });
      }
    } else {
      const jam = await Jam.findOne({
        where: { id: jamId },
        include: [{ model: Song, as: 'song', attributes: ['instruments'] }],
      });
      availableInstruments = jam.song.instruments;
    }

    const user = await User.findOne({ where: { id: userId } });
    if (availableInstruments.includes(user.instrument)) {
      await JamUsers.create({
        jamId,
        userId,
      });
      return res
        .status(201)
        .send({ message: 'User successfully added to jam' });
    } else {
      return res
        .status(403)
        .send({ message: `There is no job for you in the current jam` });
    }
  } catch (e) {
    return res.status(500).send({ message: formatError(e) });
  }
};

export { addUserToJam };
