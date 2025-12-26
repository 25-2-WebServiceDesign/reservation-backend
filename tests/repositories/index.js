const userRepo = require('./user.repository');
const storeRepo = require('./store.repository');
const reservationRepo = require('./reservation.repository');
const reservationUnitRepo = require('./reservationUnit.repository');
const operatingHourRepo = require('./operatingHour.repository');
const reservationPolicyRepo = require('./reservationPolicy.repository');
const favoriteRepo = require('./favorite.repository');
const storeClosedDayRepo = require('./storeClosedDay.repository');
const unitClosedDayRepo = require('./unitClosedDay.repository');
const reviewRepo = require('./review.repository');
const refreshTokenRepo = require('./refreshToken.repository');
const userAuthRepo = require('./userAuth.repository');

module.exports = {
  userRepo,
  storeRepo,
  reservationRepo,
  reservationUnitRepo,
  operatingHourRepo,
  reservationPolicyRepo,
  favoriteRepo,
  storeClosedDayRepo,
  unitClosedDayRepo,
  reviewRepo,
  refreshTokenRepo,
  userAuthRepo,
};
