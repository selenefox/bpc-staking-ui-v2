#!/bin/bash
docker rm bpc_testnet_chain_staking-ui_1
docker rmi bitplanet/bas-staking-ui:latest

docker build -f docker/staking-ui.Dockerfile -t bitplanet/bas-staking-ui:latest ./
