import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, get, execute, getOrNull, log, save, read } = deployments
  const { deployer, libraryDeployer } = await getNamedAccounts()

  const META_POOL_NAME = "KinesisKUSDMetaPool"
  const META_POOL_LPTOKEN_NAME = `${META_POOL_NAME}LPToken`
  const BASE_POOL_NAME = "USD3Pool"

  const TOKEN_ADDRESSES = [
    (await get("kusd")).address,
    (await get("USD3PoolLPToken")).address,
  ]
  const TOKEN_DECIMALS = [18, 18]
  const LP_TOKEN_NAME = "Kinesis USD Metapool: kusd-USD3Pool"
  const LP_TOKEN_SYMBOL = "kusd-USD3Pool"
  const INITIAL_A = 100
  const SWAP_FEE = 4e6 // 4bps
  const ADMIN_FEE = 0

  // Manually check if the pool is already deployed
  const metaPool = await getOrNull(META_POOL_NAME)
  if (metaPool) {
    log(`reusing ${META_POOL_NAME} at ${metaPool.address}`)
  } else {
    await execute(
      "MetaSwap",
      {
        from: deployer,
        log: true,
      },
      "initializeMetaSwap",
      TOKEN_ADDRESSES,
      TOKEN_DECIMALS,
      LP_TOKEN_NAME,
      LP_TOKEN_SYMBOL,
      INITIAL_A,
      SWAP_FEE,
      ADMIN_FEE,
      (
        await get("LPToken")
      ).address,
      (
        await get(BASE_POOL_NAME)
      ).address,
    )

    await save(META_POOL_NAME, await get("MetaSwap"))

    const lpTokenAddress = (await read(META_POOL_NAME, "swapStorage")).lpToken
    log(`${META_POOL_LPTOKEN_NAME} at ${lpTokenAddress}`)

    await save(META_POOL_LPTOKEN_NAME, {
      abi: (await get("LPToken")).abi, // LPToken ABI
      address: lpTokenAddress,
    })
  }
}
export default func
