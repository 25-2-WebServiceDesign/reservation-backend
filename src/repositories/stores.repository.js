// DB 접근만 담당, 검증/예외처리 x
const { Store } = require("../models");

exports.create = (data) => {
  return Store.create(data);
};

exports.findAll = () => {
  return Store.findAll();
};

exports.findById = (id) => {
  return Store.findByPk(id);
};

exports.update = async (id, data) => {
  await Store.update(data, { where: { id } });
  return Store.findByPk(id);
};

exports.remove = (id) => {
  return Store.destroy({ where: { id } });
};
