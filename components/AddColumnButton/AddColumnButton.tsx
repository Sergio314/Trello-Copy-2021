import React from "react";

import { IconContainer } from "./styles";

import PlusIcon from "../../assets/PlusIcon";
import './styles.scss'

interface Props {
  onClick: () => void;
  isFirst: boolean;
  disabled?: boolean;
}

const AddColumnButton: React.FC<Props> = ({ onClick, isFirst, disabled }) => {
  return (
    <button className="add-column-button" onClick={disabled ? ()=>{} : onClick} style={{display: disabled ? 'none' : 'flex'}}>
      <IconContainer>
        <PlusIcon />
      </IconContainer>
      <span>{isFirst ? "Add a list" : "Add another list"}</span>
    </button>
  );
};

export default AddColumnButton;
