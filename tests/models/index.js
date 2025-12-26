const sequelize = require("../config/sequelize");

// Models 불러오기
const User = require("./User");
const RefreshToken = require("./RefreshToken");
const UserAuth = require("./UserAuth")
const Store = require("./Store");
const ReservationUnit = require("./ReservationUnit");
const Favorite = require("./Favorite");
const ReservationPolicy = require('./ReservationPolicy');
const OperatingHour = require("./OperatingHour");
const StoreClosedDay = require("./StoreClosedDay");
const UnitClosedDay = require("./UnitClosedDay");
const Reservation = require("./Reservation");
const Review = require("./Review");

// 모델 간 관계 생성
// User - RefreshToken
User.hasMany(RefreshToken, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
RefreshToken.belongsTo(User, {
    foreignKey: "userId"
})

// User - UserAuth
User.hasMany(UserAuth, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
UserAuth.belongsTo(User, {
    foreignKey: "userId",
})

// User - Store
User.hasMany(Store, {
    foreignKey: "ownerId",
    onDelete: "CASCADE",
})
Store.belongsTo(User, {
    foreignKey: "ownerId",
})

// Store - ReservationUnit
Store.hasMany(ReservationUnit, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
})
ReservationUnit.belongsTo(Store, {
    foreignKey: "storeId",
})

User.belongsToMany(Store, {
    through: Favorite,
    foreignKey: "userId",
    otherKey: "storeId",
})
Store.belongsToMany(User, {
    through: Favorite,
    foreignKey: "storeId",
    otherKey: "userId",
})

// Favorite - User
User.hasMany(Favorite, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
Favorite.belongsTo(User, {
    foreignKey: "userId",
})

// Favorite - Store
Store.hasMany(Favorite, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
})
Favorite.belongsTo(Store, {
    foreignKey: "storeId",
})

// ReservationPolicy - ReservationUnit
ReservationUnit.hasOne(ReservationPolicy, {
    foreignKey: "unitId",
    onDelete: "CASCADE",
}),
ReservationPolicy.belongsTo(ReservationUnit, {
    foreignKey: "unitId",
})

// OperatingHour - ReservationPolicy
ReservationPolicy.hasMany(OperatingHour, {
    foreignKey: "policyId",
    onDelete: "CASCADE",
})
OperatingHour.belongsTo(ReservationPolicy, {
    foreignKey: "policyId",
})

// StoreClosedDay - Store
Store.hasMany(StoreClosedDay, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
})
StoreClosedDay.belongsTo(Store, {
    foreignKey: "storeId"
})

// UnitClosedDay - ReservationUnit
ReservationUnit.hasMany(UnitClosedDay, {
    foreignKey: "unitId",
    onDelete: "CASCADE",
})
UnitClosedDay.belongsTo(ReservationUnit, {
    foreignKey: "unitId"
})

// User - Reservation
User.hasMany(Reservation, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Reservation.belongsTo(User, {
  foreignKey: "userId",
});

// ReservationUnit - Reservation
ReservationUnit.hasMany(Reservation, {
  foreignKey: "unitId",
  onDelete: "CASCADE",
});
Reservation.belongsTo(ReservationUnit, {
  foreignKey: "unitId",
});


// Reservation - Review
Reservation.hasOne(Review, {
    foreignKey: "reservationId",
    onDelete: "CASCADE",
});
Review.belongsTo(Reservation, {
    foreignKey: "reservationId",
});

// User - Review
User.hasMany(Review, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});
Review.belongsTo(User, {
    foreignKey: "userId",
});

// Reservation ↔ ReservationUnit
Reservation.belongsTo(ReservationUnit, {
  foreignKey: "unitId",
});
ReservationUnit.hasMany(Reservation, {
  foreignKey: "unitId",
});

// sequelize.sync({force: true});

module.exports = {
    sequelize,
    User,
    RefreshToken,
    UserAuth,
    Store,
    ReservationUnit,
    Favorite,
    ReservationPolicy,
    OperatingHour,
    StoreClosedDay,
    UnitClosedDay,
    Reservation,
    Review,
}
