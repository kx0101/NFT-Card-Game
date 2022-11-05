import { ethers } from "ethers";

import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";
import { defenseSound } from "../assets";

const emptyAccount = "0x0000000000000000000000000000000000000000";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); // ensures that we don't have multiple listeners at once.

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
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

  const newGameTokenEventFilter = contract.filters.NewGameToken();

  AddNewEvent(newGameTokenEventFilter, provider, ({ args }) => {
    console.log("New game token created!", args);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        msg: "Game token has been successfully created!",
      });

      navigate("/create-battle");
    }
  });

  const newBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(newBattleEventFilter, provider, ({ args }) => {
    console.log("New battle started!", args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const battleMoveEventFilter = contract.filters.BattleMove();

  AddNewEvent(battleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated!", args);
  });

  const roundEndedEventFilter = contract.filters.RoundEnded();

  AddNewEvent(roundEndedEventFilter, provider, ({ args }) => {
    console.log("Round ended!", args, walletAddress);

    for (let i = 0; i < args.damagedPlayers.length; i++) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const battleEndedEventFilter = contract.filters.BattleEnded();

  AddNewEvent(battleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle ended!", args, walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        msg: "You won the battle!",
      });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        msg: "You lost the battle!",
      });
    }

    navigate("/create-battlle");
  });
};
