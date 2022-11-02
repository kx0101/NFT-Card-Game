import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";

import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";

const CreateBattle = () => {
  const { contract, battleName, setBattleName } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);

  const navigate = useNavigate();

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;

    try {
      await contract.createBattle(battleName);

      setWaitBattle(true);
    } catch (error) {}
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          onChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />

        <p
          className={`${styles.infoText} mt-4`}
          onClick={() => navigate("/join-battle")}
        >
          Or join already existing battles
        </p>
      </div>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
);
