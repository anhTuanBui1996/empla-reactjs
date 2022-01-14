import styled from "styled-components";

const Button = styled.button.attrs((props) => ({
  bgColor: props.bgColor ? props.bgColor : "",
  bgHoverColor: props.bgHoverColor ? props.bgHoverColor : "",
  borderRadius: props.borderRadius ? props.borderRadius : "",
}))`
  color: ${(props) => (props.color ? props.color : " #fff")};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : " 5px"};
  font-weight: 500;
  background: transparent;
  cursor: ${(props) => (props.disabled ? "" : "pointer")};
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: ${(props) =>
    props.disabled
      ? ""
      : `inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);`}
  outline: none;
  background: ${(props) =>
    props.disabled ? "#e7e7e7" : props.bgColor ? props.bgColor : "#2c7be5"};
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
    ${(props) => (props.disabled ? "" : "color: #fff;")}
  }
  &:hover::after {
    ${(props) => (props.disabled ? "" : "width: 100%;")}
  }
  &:active {
    top: 2px;
  }
`;

export default Button;
