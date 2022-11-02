import { ethers } from "ethers";

import { ABI } from "../contract";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); // ensures that we don't have multiple listeners at once.

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
}) => {
  const newPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    console.log("New player created!", args);

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        msg: "Player has been successfully registered!",
      });
    }
  });
};
