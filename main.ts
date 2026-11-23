// BTC Race 24h - entry bot
// Trades CBBTC minute-by-minute using sliced accumulation + trailing guard

import { runBars, type OrderInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const WINDOW_BARS = 1440;
const MAX_SLIP = 10_000;

// Slice params: buy in SLICES_IN bars, sell in SLICES_OUT bars at the end
const SLICES_IN = 20;
const SLICES_OUT = 20;

// Trailing stop after full position built
const TRAIL_BPS = 400;  // 4%

let decided = false;
let positionBuilt = false;
let peakPrice: bigint | null = null;
let slicesBought = 0;
let entryPrice: bigint | null = null;

await runBars({
  onBatch(state): OrderInput[] {
    if (state.warmingUp) return [];
    const close = state.close(SYMBOL);
    if (close === null) return [];

    // Track bar index
    const i = Math.round((state.t - state.hello.first_close_ms) / 60_000);
    if (i >= WINDOW_BARS - 1) return [];

    const pos = state.positions.get(SYMBOL);
    const qty = pos?.qty ?? 0n;

    // Phase 1: Accumulate
    if (!positionBuilt && i < SLICES_IN && state.cash > 0n) {
      const remaining = SLICES_IN - slicesBought;
      const notional = state.cash / BigInt(remaining);
      if (notional <= 0n) return [];
      slicesBought++;
      if (slicesBought === 1) entryPrice = close;
      if (slicesBought === SLICES_IN) {
        positionBuilt = true;
        peakPrice = close;
      }
      return [{
        side: 'buy',
        symbol: SYMBOL,
        notional_quote_units: notional,
        max_slippage_bps: MAX_SLIP
      }];
    }

    // Phase 2: Hold with trailing stop
    if (positionBuilt && qty > 0n) {
      if (peakPrice === null) peakPrice = close;
      peakPrice = close > peakPrice ? close : peakPrice;

      // Trailing stop
      const trailStop = (peakPrice * BigInt(10000 - TRAIL_BPS)) / 10000n;
      if (close < trailStop) {
        return [{
          side: 'sell',
          symbol: SYMBOL,
          qty,
          max_slippage_bps: MAX_SLIP
        }];
      }

      // Phase 3: Final unwind in last SLICES_OUT bars
      if (i >= WINDOW_BARS - SLICES_OUT) {
        const remaining = WINDOW_BARS - i;
        const sliceQty = qty / BigInt(remaining);
        if (sliceQty > 0n) {
          return [{
            side: 'sell',
            symbol: SYMBOL,
            qty: sliceQty,
            max_slippage_bps: MAX_SLIP
          }];
        }
      }

      return [];
    }

    // Flatten any residual at end
    if (i >= WINDOW_BARS - 1 && qty > 0n) {
      return [{
        side: 'sell',
        symbol: SYMBOL,
        qty,
        max_slippage_bps: MAX_SLIP
      }];
    }

    return [];
  },
});