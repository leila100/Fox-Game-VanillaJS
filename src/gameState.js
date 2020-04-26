const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  tick() {
    this.clock++;
    console.log(this.clock);
    if (this.clock === this.wakeTime) this.wake();
    return this.clock;
  },
  startGame() {
    console.log("Hatching");
    this.current = "HATCHING";
    this.wakeTime = this.wakeTime + 3;
  },
  wake() {
    console.log("hatched");
    this.current = "IDLING";
    this.wakeTime = -1;
  },
  handleUserAction(icon) {
    console.log(icon);
  },
};

module.exports = gameState;
