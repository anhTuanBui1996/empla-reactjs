import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button`
  color: ${(props) => (props.color ? props.color : " #fff")};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : " 5px"};
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  background: ${(props) => (props.bgColor ? props.bgColor : "#2c7be5")};
  border: none;
  z-index: 1;
  &::after {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: ${(props) =>
      props.bgHoverColor ? props.bgHoverColor : "#1a68d1"};
    border-radius: ${(props) =>
      props.borderRadius ? props.borderRadius : " 5px"};
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  &:hover {
    color: #fff;
  }
  &:hover::after {
    width: 100%;
  }
  &:active {
    top: 2px;
  }
`;

Button.propTypes = {
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  bgColor: PropTypes.string,
  bgHoverColor: PropTypes.string,
  borderRadius: PropTypes.string,
};

export default Button;
