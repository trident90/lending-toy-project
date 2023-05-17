// 
// SPDX-License-Identifier: UNLICENSED
//
pragma solidity ^0.8.0;

interface IERC20Token {
    function balanceOf(address owner) external returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function decimals() external returns (uint256);
}