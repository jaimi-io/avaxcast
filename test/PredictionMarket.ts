import { expect } from "chai";
import { ethers } from "hardhat";

enum Market {
  AvaxUsd = 0,
  BtcUsd,
  EthUsd,
  LinkUsd,
}

enum Vote {
  Yes = 0,
  No,
}

describe("PredictionMarket", function () {
  before(async function () {
    this.PredictionMarket = await ethers.getContractFactory(
      "contracts/PredictionMarket.sol:PredictionMarket"
    );
  });

  beforeEach(async function () {
    [this.owner, this.addr1] = await ethers.getSigners();
    this.predictionMarket = await this.PredictionMarket.deploy(Market.AvaxUsd);
    await this.predictionMarket.deployed();
  });

  describe("Constructor", function () {
    it("Should set market correctly", async function () {
      expect(await this.predictionMarket.market()).to.equal(Market.AvaxUsd);
    });
  });

  describe("Buy Shares", function () {
    it("Should set total number of yes votes correctly", async function () {
      await this.predictionMarket.buyShares(Vote.Yes, {
        value: ethers.utils.parseEther("0.05"),
      });
      expect(await this.predictionMarket.numberShares(Vote.Yes)).to.equal(5);
    });

    it("Should set total number of no votes correctly", async function () {
      await this.predictionMarket.buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.1"),
      });
      await this.predictionMarket.connect(this.addr1).buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.03"),
      });
      expect(await this.predictionMarket.numberShares(Vote.No)).to.equal(13);
    });

    it("Should set number of votes individually correctly", async function () {
      await this.predictionMarket.buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.05"),
      });
      await this.predictionMarket.connect(this.addr1).buyShares(Vote.No, {
        value: ethers.utils.parseEther("0.02"),
      });
      await this.predictionMarket.connect(this.addr1).buyShares(Vote.Yes, {
        value: ethers.utils.parseEther("0.03"),
      });
      expect(
        await this.predictionMarket.sharesPerPerson(this.owner.address, Vote.No)
      ).to.equal(5);
      expect(
        await this.predictionMarket.sharesPerPerson(this.addr1.address, Vote.No)
      ).to.equal(2);
      expect(
        await this.predictionMarket.sharesPerPerson(
          this.addr1.address,
          Vote.Yes
        )
      ).to.equal(3);
    });
  });
});
