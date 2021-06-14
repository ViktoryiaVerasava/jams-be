import model from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import { Op } from 'sequelize';
import formatError from '../utils/formatError.util';
const { User } = model;

const create = async (req, res) => {
  const { firstName, lastName, email, password, phone, instrument } = req.body;
  try {
    const user = await User.findOne({
      where: { [Op.or]: [{ phone }, { email }] },
    });
    if (user) {
      return res
        .status(422)
        .send({ message: 'User with that email or phone already exists' });
    }
    await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 8),
      phone,
      instrument,
    });
    return res.status(201).send({ message: 'Account created successfully' });
  } catch (e) {
    return res.status(500).send({ message: formatError(e) });
  }
};

const findAll = async (_, res) => {
  try {
    const users = await User.findAll();
    return res.send({ data: users });
  } catch (e) {
    return res.status(500).send({ message: formatError(e) });
  }
};

const findOne = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findOne({ where: { id: id } }).then((data) => {
      if (data) {
        return res.send({ data: [data] });
      } else {
        return res.status(404).send({ message: 'User Not found' });
      }
    });
  } catch (e) {
    res.status(500).send({
      message: formatError(e, 'Error retrieving user'),
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      email &&
      (await User.findOne({
        where: {
          email,
        },
      }));
    if (!user) {
      return res.status(404).send({ message: 'User Not found' });
    }
    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (e) {
    return res.status(500).send({ message: formatError(e) });
  }
};

export { create, findOne, findAll, signIn };
