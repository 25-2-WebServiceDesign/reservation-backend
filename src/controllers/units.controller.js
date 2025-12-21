const unitsService = require("../services/units.service");

exports.createUnit = async (req, res, next) => {
  try {
    const unit = await unitsService.createUnit(req.body);
    res.status(201).json(unit);
  } catch (err) {
    next(err);
  }
};

exports.getUnits = async (req, res, next) => {
  try {
    const units = await unitsService.getUnits();
    res.status(200).json(units);
  } catch (err) {
    next(err);
  }
};

exports.getUnitById = async (req, res, next) => {
  try {
    const unit = await unitsService.getUnitById(req.params.unitId);
    res.status(200).json(unit);
  } catch (err) {
    next(err);
  }
};

exports.updateUnit = async (req, res, next) => {
  try {
    const unit = await unitsService.updateUnit(
      req.params.unitId,
      req.body
    );
    res.status(200).json(unit);
  } catch (err) {
    next(err);
  }
};

exports.deleteUnit = async (req, res, next) => {
  try {
    await unitsService.deleteUnit(req.params.unitId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getUnitAvailability = async (req, res, next) => {
  try {
    const unitId = Number(req.params.id);
    const { date } = req.query;

    if (!unitId || Number.isNaN(unitId)) {
      return res.status(400).json({ message: "Invalid unitId" });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date (YYYY-MM-DD)" });
    }

    const result = await unitsService.getUnitAvailability({ unitId, date });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};