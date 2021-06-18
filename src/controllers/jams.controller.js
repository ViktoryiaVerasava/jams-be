import { Op } from 'sequelize';
import model from '../models';
import formatError from '../utils/formatError.util';
import { removeFromArray } from '../utils/removeFromArray.util';

const { Jam, Song, User } = model;

const create = async (req, res) => {
  try {
    const { name, userId, songId } = req.body;
    console.log(req.body);
    await Jam.create({
      name,
      userId,
      songId,
      isStarted: false,
    });
    return res.status(201).send({ message: 'Jam created successfully' });
  } catch (e) {
    return res.status(500).send({ message: formatError(e) });
  }
};

const findAll = async (req, res) => {
  const my = req.query.my;
  const available = req.query.available;
  const participations = req.query.participations;
  if (my) {
    return findAllHotedByCurrentUser(req, res);
  }
  if (available) {
    return findAllAvailableForCurrentUser(req, res);
  }
  if (participations) {
    return findAllParticipationsOfCurrentUser(req, res);
  }
  return findAllHostedByAnyUser(req, res);
};

const findAllHostedByAnyUser = async (_, res) => {
  try {
    const jams = await Jam.findAll({
      include: [
        { model: Song, as: 'song', attributes: ['name', 'instruments'] },
        { model: User, as: 'host', attributes: ['firstName', 'lastName'] },
      ],
      attributes: ['id', 'isStarted'],
    });
    res.send({ data: jams });
  } catch (e) {
    return res
      .status(500)
      .send({ message: formatError(e, 'Error retrieving jams') });
  }
};

const findAllAvailableForCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    const userInstrument = user.instrument;
    const jams = await Jam.findAll({
      include: [
        {
          model: Song,
          as: 'song',
          attributes: ['name', 'instruments'],
          where: {
            instruments: { [Op.contains]: [userInstrument] },
          },
        },
        { model: User, as: 'host', attributes: ['firstName', 'lastName'] },
        {
          model: User,
          as: 'participants',
          attributes: ['firstName', 'lastName', 'instrument', 'id'],
        },
      ],
      where: {
        [Op.or]: [
          { '$participants.id$': null },
          {
            isStarted: false,
          },
        ],
      },
      attributes: ['id', 'isStarted'],
    });
    const jamsWhereNotParticipant = jams.filter(
      (j) => !j.participants.some((p) => p.id === userId)
    );
    const jamsWithAvailableInstrument = jamsWhereNotParticipant.filter((j) => {
      const allInstruments = j.song.instruments;
      const occupiedInstruments =
        j.participants?.map((p) => p.instrument) || [];
      const availableInstruments = removeFromArray(
        allInstruments,
        occupiedInstruments
      );
      return availableInstruments.includes(userInstrument);
    });
    res.send({ data: jamsWithAvailableInstrument });
  } catch (e) {
    return res
      .status(500)
      .send({ message: formatError(e, 'Error retrieving jams') });
  }
};

const findAllParticipationsOfCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const jams = await Jam.findAll({
      include: [
        {
          model: Song,
          as: 'song',
          attributes: ['name', 'instruments'],
        },
        { model: User, as: 'host', attributes: ['firstName', 'lastName'] },
        {
          model: User,
          as: 'participants',
          attributes: ['firstName', 'lastName', 'instrument', 'id'],
          where: {
            id: userId,
          },
        },
      ],
      attributes: ['id', 'isStarted'],
    });

    res.send({ data: jams });
  } catch (e) {
    return res
      .status(500)
      .send({ message: formatError(e, 'Error retrieving jams') });
  }
};

const findAllHotedByCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const jams = await Jam.findAll({
      where: {
        userId: userId,
      },
      include: [
        { model: Song, as: 'song', attributes: ['name', 'instruments'] },
        { model: User, as: 'host', attributes: ['firstName', 'lastName'] },
        {
          model: User,
          as: 'participants',
          attributes: ['firstName', 'lastName', 'instrument'],
        },
      ],
      attributes: ['id', 'isStarted'],
    });

    res.send({ data: jams });
  } catch (e) {
    return res
      .status(500)
      .send({ message: formatError(e, 'Error retrieving jams') });
  }
};

const findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const jam = await Jam.findOne({ where: { id: id } });
    if (jam) {
      return res.send({ data: [jam] });
    } else return res.status(404).send({ message: 'Jam Not found' });
  } catch (err) {
    res.status(500).send({
      message: formatError(e, 'Error retrieving jam'),
    });
  }
};

const startJam = async (req, res) => {
  try {
    const id = req.params.id;
    const jam = await Jam.findOne({
      where: { id },
      include: [
        { model: User, as: 'participants', attributes: ['id'] },
        { model: Song, as: 'song', attributes: ['instruments'] },
      ],
      attributes: ['id', 'isStarted'],
    });
    if (
      !jam.isStarted &&
      jam?.song?.instruments.length === jam?.participants.length
    ) {
      await jam.update({ isStarted: true });
      return res.status(204).send({ message: 'Jam started' });
    } else
      return res.status(403).send({ message: 'Not allowed to start this jam' });
  } catch (err) {
    res.status(500).send({
      message: formatError(e, 'Error updating jam'),
    });
  }
};

export { create, findOne, findAll, startJam };
