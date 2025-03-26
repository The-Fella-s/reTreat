const mongoose = require("mongoose");

const squareBusinessAccountSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
      unique: true,
    },
    merchantName: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: function(v) {
          return v instanceof Date && !isNaN(v);
        },
        message: props => `${props.value} is not a valid date!`
      },
      default: () => new Date(Date.now() + 3600000) // Default to 1 hour from now
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add method to check if token is expired
squareBusinessAccountSchema.methods.isTokenExpired = function() {
  return new Date() > this.expiresAt;
};

const SquareBusinessAccount = mongoose.model("SquareBusinessAccount", squareBusinessAccountSchema);

module.exports = SquareBusinessAccount;