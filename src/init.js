/*
This is a technique where we can say to the browser: 
  "Hey! Browser! Next time you have an idle moment, call me 😉" complete with winky face. 
As you may imagine, this can be very frequent, and we don't want our browser to execute at lightspeed. 
So in this case, we're saying, "check to see if it's been 3 seconds. If it has, call tick. If not, chill and wait for the next frame. 
This way, we're guaranteed to run tick every three seconds, give or take a few milliseconds 
(since the browser will wait until it's idle to call.)
*/
import initButtons from "./buttons";
import game from "./gameState";
import { TICK_RATE } from "./constants";

async function init() {
  console.log("starting game");
  initButtons(game.handleUserAction);

  let nextTimeToTick = Date.now();
  function nextAnimationFrame() {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      game.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  }

  nextAnimationFrame();
}

init();
