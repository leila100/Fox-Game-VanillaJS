import { modFox, modScene } from "./ui";
import { SCENES, RAIN_CHANCE, DAY_LENGTH, NIGHT_LENGTH,
  getNextHungerTime, getNextDieTime, } from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleeptime: -1,
  hungryTime: -1,
  dieTime: -1,
  tick() {
    this.clock++;
    console.log(this.clock);
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    return this.clock;
  },
  startGame() {
    console.log("Hatching");
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
  },
  wake() {
    console.log("awake");
    this.current = "IDLING";
    this.wakeTime = -1;
    modFox("idling");
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
  },
  handleUserAction(icon) {
    // can't do actions while in these states
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      // do nothing
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    } 

    // execute the currently selected action
    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    console.log("changeWeather");
  },
  cleanUpPoop() {
    console.log("cleanUpPoop");
  },
  feed() {
    console.log("feed");
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night")
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.hungryTime = -1;
    this.dieTime = getNextDieTime(this.clock)
    modFox("hungry");
  },
  die() {
    console.log("fox is dead")
    modFox("dead");
    modScene("dead")
  }
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
