import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MdArrowDropDown } from "react-icons/md";
import Outclick from "../../hoc/Outclick";
import styledComponents from "styled-components";

function Dropdown({
  className,
  title,
  variant,
  position,
  style,
  toggleStyle,
  toggleOnHover,
  boxStyle,
  isForceClose,
  onClose,
  children,
}) {
  const [isOpened, setOpen] = useState(false);
  const handleClose = () => {
    onClose && onClose();
    setOpen(false);
  };
  const handleToggle = (e) => {
    e.stopPropagation();
    isOpened && onClose && onClose();
    setOpen(!isOpened);
  };
  useEffect(() => {
    if (isForceClose !== undefined) {
      isForceClose && setOpen(false);
    }
  }, [isForceClose]);
  return (
    <div className="dropdown" style={style ? style : null}>
      <ToggleButton
        className={`btn btn-${variant} h5 mb-0 px-2 py-2${
          className ? ` ${className}` : ""
        }`}
        style={toggleStyle ? toggleStyle : null}
        onClick={!toggleOnHover ? handleToggle : undefined}
        onMouseEnter={toggleOnHover ? handleToggle : undefined}
        onMouseLeave={toggleOnHover ? handleToggle : undefined}
      >
        {title || <MdArrowDropDown size={1.5} />}
      </ToggleButton>
      <Outclick onOutClick={handleClose}>
        <div
          className={`shadow dropdown-menu dropdown-menu-${position}${
            isOpened ? " d-flex" : ""
          }`}
          style={boxStyle ? boxStyle : null}
          onMouseLeave={toggleOnHover ? handleToggle : undefined}
        >
          {children}
        </div>
      </Outclick>
    </div>
  );
}

Dropdown.propTypes = {
  className: PropTypes.string,
  /**
   * Content on the toggle button
   */
  title: PropTypes.any,
  /**
   * Theme for toggle button
   */
  variant: PropTypes.string,
  /**
   * The position of dropbox to the toggle button
   */
  position: PropTypes.oneOf(["up", "down", "left", "right"]),
  /**
   * Style for container
   */
  style: PropTypes.object,
  /**
   * Style for toggle button
   */
  toggleStyle: PropTypes.object,
  /**
   * True if you want open dropdown box on hover
   */
  toggleOnHover: PropTypes.bool,
  /**
   * Style for dropdown box
   */
  boxStyle: PropTypes.object,
  /**
   * When set to true, the dropdown is force close (collapse)
   */
  isForceClose: PropTypes.bool,
  /**
   * Handler when the dropbox is closed
   */
  onClose: PropTypes.func,
};
Dropdown.defaultProps = {
  variant: "primary",
  position: "down",
};

const ToggleButton = styledComponents.button`
  border-radius: 5px;
  :active, :focus {
    box-shadow: none;
    outline: none;
  }
`;

export default Dropdown;
