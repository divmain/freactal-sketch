import React from "react";
import ReactDOM from "react-dom";
import { provideState, injectState, update } from "freactal";


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const App = ({ state: { counter, hasUpdatesQueued }, effects }) => (
  <div>
    <h1>Freactal Sketch</h1>
    <p>{`The counter is at ${counter}`}</p>
    <p>{`The counter ${hasUpdatesQueued ? "has " : "doesn't have "} updates queued.`}</p>
    <button onClick={effects.addOne}>Add one</button>
    <button onClick={effects.addOneAfterWait}>Add one after 1 sec</button>
  </div>
);

const wrapComponentWithState = provideState({
  initialState: () => ({
    counter: 0,
    operationsInProgress: 0
  }),
  computed: {
    hasUpdatesQueued: ({ operationsInProgress }) => !!operationsInProgress
  },
  effects: {
    addOne: update(state => ({ counter: state.counter + 1 })),
    setInProgress: update(
      (state, operationsInProgress) => ({ operationsInProgress: state.operationsInProgress + (operationsInProgress ? 1 : -1) })
    ),
    addOneAfterWait: async effects => {
      await effects.setInProgress(true);
      await delay(1000);
      await effects.addOne();
      await effects.setInProgress(false);
      return state => state;
    }
  }
});

const StatefulApp = wrapComponentWithState(injectState(App));
ReactDOM.render(<StatefulApp />, document.getElementById("root"));
