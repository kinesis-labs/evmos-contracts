// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
import "@boringcrypto/boring-solidity-e06e943/contracts/libraries/BoringERC20.sol";

interface IRewarder {
    using BoringERC20 for IERC20;

    function onkinesisReward(
        uint256 pid,
        address user,
        address recipient,
        uint256 kinesisAmount,
        uint256 newLpAmount
    ) external;

    function pendingTokens(
        uint256 pid,
        address user,
        uint256 kinesisAmount
    ) external view returns (IERC20[] memory, uint256[] memory);
}
