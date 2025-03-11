const crypto = require('crypto');
const {convertToTwoLetterCode} = require("../countryMapping");
const {SquareError} = require("square");

async function createCard(client, customerId, cardDetails) {
  const {
    cardholderName,
    expMonth,
    expYear,
    addressLine1,
    administrativeDistrictLevel1,
    country,
    firstName,
    lastName,
    locality,
    postalCode
  } = cardDetails;

  if (expMonth === undefined || expYear === undefined) {
    throw new Error("Expiration month and year are required");
  }

  // Map country code using our helper function.
  const mappedCountry = convertToTwoLetterCode(country);
  if (!mappedCountry) {
    throw new Error(`Invalid or unsupported country: ${country}`);
  }

  const idempotencyKey = crypto.randomUUID();

  const createResponse = await client.cards.create({
    sourceId: "cnon:card-nonce-ok",
    idempotencyKey,
    card: {
      billingAddress: {
        addressLine1,
        administrativeDistrictLevel1,
        country: mappedCountry,
        firstName,
        lastName,
        locality,
        postalCode,
      },
      cardholderName,
      customerId,
      expMonth: BigInt(expMonth),
      expYear: BigInt(expYear),
    },
  });

  return createResponse.card;
}

async function deleteFirstCard(client, customerId) {
  const listResponse = await client.cards.list({ customerId });

  if (!listResponse.data || listResponse.data.length === 0) {
    throw new Error('No cards found for this customer');
  }

  const firstCardId = listResponse.data[0].id;
  const response = await client.cards.disable({
    cardId: firstCardId,
  });

  return response;
}

function handleCardError(error, res, next) {
  if (error instanceof SquareError) {
    res.status(error.statusCode || 500).json({ error: error.message });
  } else if (error.message.includes('required')) {
    res.status(400).json({ error: error.message });
  } else if (next) {
    next(error);
  } else {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createCard, deleteFirstCard, handleCardError };
