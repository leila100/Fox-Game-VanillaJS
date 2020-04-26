const gameState = {
  current: "INIT",
  clock: 1,
  tick() {
    this.clock++;
    console.log(this.clock);
    return this.clock;
  },
  handleUserAction(icon) {
    console.log(icon);
  },
};

module.exports = gameState;