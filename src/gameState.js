import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import { SCENES, RAIN_CHANCE, DAY_LENGTH, NIGHT_LENGTH,
  getNextHungerTime, getNextDieTime, getNextPoopTime } from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleeptime: -1,
  hungryTime: -1,
  dieTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  timeToPoop: -1,
  tick() {
    this.clock++;
    console.log(this.clock);
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating) this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.timeToPoop) this.poop()
    return this.clock;
  },
  startGame() {
    console.log("Hatching");
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
    writeModal();
  },
  wake() {
    console.log("awake");
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
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
    this.scene = (1 + this.scene) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    if (this.current === "POOPING") {
      this.dieTime = -1;
      togglePoopBag(true);
      this.startCelebrating();
      this.hungryTime = getNextHungerTime(this.clock);
    }
  },
  feed() {
    if (this.current !== "HUNGRY") return;
    this.current = "FEEDING";
    this.dieTime = -1;
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
    this.timeToPoop = getNextPoopTime(this.clock);
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
    this.current = "DEAD";
    modFox("dead");
    modScene("dead");
    this.sleepTime = -1;
    writeModal("The fox died :( <br/> Press the middle button to start");
  },
  startCelebrating() {
    this.current = "CELEBRATING"
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.current = "IDLING";
    this.timeToEndCelebrating = -1;
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === 'IDLING') {
      if (SCENES[this.scene] === "rain") modFox("rain");
      else modFox("idling");
    }
  },
  poop() {
    this.current = "POOPING";
    this.timeToPoop = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  }
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
