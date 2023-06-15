import styled from "styled-components";

const Button = styled.button.attrs((props) => ({
  bgColor: props.bgColor ? props.bgColor : "#0276ff",
  bgHoverColor: props.bgHoverColor ? props.bgHoverColor : "#1c84ff",
  borderRadius: props.borderRadius ? props.borderRadius : "8px",
  padding: props.padding ? props.padding : "15px 21px",
  disabled: props.disabled ? props.disabled : false,
}))`
    align-items: center;
    appearance: button;
    background-color: ${(props) =>
      props.disabled ? "#b1c2d9" : props.bgColor};
    }};
    border-radius: ${(props) => props.borderRadius};
    border-style: none;
    box-shadow: rgba(255, 255, 255, 0.26) 0 1px 2px inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    font-size: 100%;
    justify-content: center;
    line-height: 1.5;
    margin: 0;
    padding: ${(props) => props.padding};
    text-align: center;
    text-transform: none;
    transition: color 0.13s ease-in-out, background 0.13s ease-in-out,
      opacity 0.13s ease-in-out, box-shadow 0.13s ease-in-out;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  &:active {
    background-color: #006ae8;
  }

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#b1c2d9" : props.bgHoverColor};
  }
`;

export default Button;
