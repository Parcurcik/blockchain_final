import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VotingSystem } from "../typechain-types"; 

const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("VotingSystem", {
    from: deployer, 
    args: [], 
    log: true, 
    autoMine: true, 
  });

  const votingContract = await hre.ethers.getContract<VotingSystem>("VotingSystem", deployer);


  console.log("VotingSystem deployed successfully!");
};

export default deployVotingContract;

deployVotingContract.tags = ["VotingSystem"];

