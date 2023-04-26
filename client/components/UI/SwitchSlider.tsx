import React from "react";
import styled from "styled-components";
import { BiSun, BiMoon } from "react-icons/bi";

const SwitchSliderStyle = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;
const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.5;
  border-radius: 12px;
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 12px;
    transition: 0.5s ease;
  }
  input:checked + &:before {
    transform: translateX(26px);
  }
  input:checked + & {
    background-color: red;
    transition: 0.4s;
  }
`;

type SwitchSliderProps = {
  isToggle: boolean;
  onClick: () => void;
};
const SwitchSlider = ({ isToggle, onClick }: SwitchSliderProps) => {
  return (
    <SwitchSliderStyle>
      <CheckBox type="checkbox" onClick={onClick} checked={isToggle} />
      <Slider />
    </SwitchSliderStyle>
  );
};

export default SwitchSlider;
