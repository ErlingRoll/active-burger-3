export class SimpleRateLimiter {
  private tokens: number;
  private lastRefillMs: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number
  ) {
    this.tokens = capacity;
    this.lastRefillMs = Date.now();
  }

  allow(cost = 1): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastRefillMs) / 1000;
    if (elapsed > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSecond);
      this.lastRefillMs = now;
    }
    if (this.tokens >= cost) {
      this.tokens -= cost;
      return true;
    }
    return false;
  }
}
