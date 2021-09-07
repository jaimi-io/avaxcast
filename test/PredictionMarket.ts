/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import { ethers } from "hardhat";
import { sleep } from "../scripts/helpers";
import Market, { Vote } from "../frontend/src/common/enums";

const PREDICTED_PRICE = 50;
const MS_TO_SECS = 1000;
const MARKET_DURATION = 10;

describe("PredictionMarket", function () {
  before(async function () {
    this.PredictionMarket = await ethers.getContractFactory(
      "contracts/PredictionMarket.sol:PredictionMarket"
    );
  });

  beforeEach(async function () {
    [this.owner, this.addr1] = await ethers.getSigners();
    const tenSecDelay = Math.floor(Date.now() / MS_TO_SECS) + MARKET_DURATION;
    this.predictionMarket = await this.PredictionMarket.deploy(
      Market.AVAX,
      PREDICTED_PRICE,
      tenSecDelay
    );
    await this.predictionMarket.deployed();
  });

  describe("Constructor", function () {
    it("Should set market correctly", async function () {
      expect((await this.predictionMarket.marketInfo()).market).to.equal(
        Market.AVAX
      );
    });
  });

  describe("Buy Shares", function () {
    it("Should set total number of yes votes correctly", async function () {
      await this.predictionMarket.buyShares(Vote.Yes, {
        value: ethers.utils.parseEther("0.05"),
      });
      expect(
        (await this.predictionMarket.marketInfo()).numberYesShares
      ).to.equal(5);
    });

    it("Should set total number of no votes correctly", async function () {
      await this.predictionMarket.buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.13"),
      });

      expect(
        (await this.predictionMarket.marketInfo()).numberNoShares
      ).to.equal(13);
    });

    it("Should set number of votes individually correctly", async function () {
      await this.predictionMarket.buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.05"),
      });

      expect(
        await this.predictionMarket.sharesPerPerson(this.owner.address, Vote.No)
      ).to.equal(5);
    });

    it("Should not be able to buy shares after end time", async function () {
      const tenSeconds = 10000;
      await sleep(tenSeconds);
      expect(
        this.predictionMarket.buyShares(Vote.No, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("Cannot buy shares after market endTime");
    });
  });
});
