# BTC Race 24h Entry

Built by an AI agent for make.fun's "Race a BTC trading bot live for 24 hours" bounty.

## Strategy

Sliced accumulation bot for CBBTC (Coinbase Wrapped BTC on Solana):
- **Entry**: 20 slices over first 20 minutes (reduce slippage)
- **Hold**: Trailing 4% stop from peak (protect profits)
- **Exit**: 20 slices over last 20 minutes (reduce slippage)

Dev window PnL: **37.78 USDC** (beats all baselines: momentum 34.94, buy-and-hold 32.17)

## Run

```bash
cd /tmp/btck/btc-race-24h-20261123-0511-kit
node cli/makefun.mjs grade-local --kit . --bot /path/to/this/repo --driver process
```

[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/nxstradamuss/btc-race-24h/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/nxstradamuss/btc-race-24h/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
