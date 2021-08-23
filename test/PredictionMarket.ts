import { expect } from "chai";
import { ethers } from "hardhat";

enum Market {
  AvaxUsd = 0,
  BtcUsd,
  EthUsd,
  LinkUsd,
}

describe("PredictionMarket", function () {
  before(async function () {
    this.PredictionMarket = await ethers.getContractFactory(
      "contracts/PredictionMarket.sol:PredictionMarket"
    );
  });

  beforeEach(async function () {
    this.predictionMarket = await this.PredictionMarket.deploy(Market.AvaxUsd);
    await this.predictionMarket.deployed();
  });

  describe("Constructor", function () {
    it("Should set market correctly", async function () {
      expect(await this.predictionMarket.market()).to.equal(Market.AvaxUsd);
    });
  });
});
