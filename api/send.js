const { ethers } = require("ethers");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) return res.status(500).json({ message: "Private key not set" });

  const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const tokenAddress = "0x899357E54C2c4b014ea50A9A7Bf140bA6Df2eC73";
  const toAddress = "0x8bda3f68f71e02a6bd64aaaefd8bb249bdceb613";

  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];

  try {
    const token = new ethers.Contract(tokenAddress, abi, wallet);
    const balance = await token.balanceOf(wallet.address);
    if (balance.isZero()) return res.json({ message: "Token balance is zero." });

    const tx = await token.transfer(toAddress, balance);
    await tx.wait();
