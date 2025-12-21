const user = require('./user.repository');
const store = require('./store.repository');
const reservation = require('./reservation.repository');
const reservationUnit = require('./reservationUnit.repository');
const operatingHour = require('./operatingHour.repository');
const reservationPolicy = require('./reservationPolicy.repository');
const favorite = require('./favorite.repository');
const storeClosedDay = require('./storeClosedDay.repository');
const unitClosedDay = require('./unitClosedDay.repository');
const review = require('./review.repository');
const refreshToken = require('./refreshToken.repository');
const userAuth = require('./userAuth.repository');

module.exports = {
  user,
  store,
  reservation,
  reservationUnit,
  operatingHour,
  reservationPolicy,
  favorite,
  storeClosedDay,
  unitClosedDay,
  review,
  refreshToken,
  userAuth,
};
