import React, { useState, useMemo } from "react";
import styledComponents from "styled-components";
import PropTypes from "prop-types";

/**
 * A grid system container that used translate animation when a card
 * is removed.
 * {GridAnimated} component is require at least 1 {GridCard} compopent as
 * a children node, and doesn't have any other component, otherwise the
 * animation can not be applied.
 */
function GridAnimated({ flexProps, isSameAsRow, children }) {
  const { direction, wrap, justifyContent, alignItems } = flexProps;

  const cardPositionSet = useMemo(() => {
    return new Array(React.Children.count(children));
    // eslint-disable-next-line
  }, []);
  const gridStateArr = useMemo(() => {
    let arrLength = React.Children.count(children);
    let res = new Array(arrLength);
    res.fill({ isTranslate: false, isHide: false });
    return res;
    // eslint-disable-next-line
  }, []);
  const [gridState, setGridState] = useState(gridStateArr);

  const hideCard = (index) => {
    setGridState((state) => [
      ...state.slice(0, index),
      {
        ...state[index],
        isHide: true,
      },
      ...state.slice(index + 1).map((card) => ({
        ...card,
        isTranslate: true,
      })),
    ]);
  };
  const stopTranslate = () => {
    setGridState((state) =>
      state.map((card) => ({
        ...card,
        isTranslate: false,
      }))
    );
  };

  const childrenWithProps = React.Children.map(children, (card, index) => (
    <GridCard
      ref={(cardRef) => {
        if (cardRef) {
          let { x, y } = cardRef.getClientRects().item(0);
          cardPositionSet[index] = { x, y };
        }
      }}
      key={index}
      gridCards={cardPositionSet}
      className="grid-anim-card"
      cardIndex={index}
      isTranslate={gridState[index]?.isTranslate}
    >
      {React.cloneElement(card, {
        onHideCard: () => hideCard(index),
        forceStopTranslate: stopTranslate,
      })}
    </GridCard>
  ));

  return (
    <GridContainer
      className="grid-anim-container"
      direction={direction}
      wrap={wrap}
      justifyContent={justifyContent}
      alignItems={alignItems}
      sameAsRow={isSameAsRow}
    >
      {childrenWithProps}
    </GridContainer>
  );
}

const GridContainer = styledComponents.div`
  position: relative;
  display: flex;
  ${(props) => (props.sameAsRow ? `margin: 0 -12px;` : "")}
  flex-wrap: ${(props) => props.wrap};
  flex-direction: ${(props) => props.direction};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
`;
export const GridCard = styledComponents.div`
  ${(props) => {
    const { gridCards, cardIndex, isTranslate } = props;
    if (!isTranslate || cardIndex === 0) return "";
    let currentCard = gridCards[cardIndex];
    let previousCard = gridCards[cardIndex - 1];
    let transX = previousCard.x - currentCard.x;
    let transY = previousCard.y - currentCard.y;
    return `
      transition: transform ease-out 0.5s;
      transform: translate(${transX}px, ${transY}px);
    `;
  }}
`;

GridAnimated.propTypes = {
  /**
   * Object include flex-box related properties
   */
  flexProps: PropTypes.shape({
    wrap: PropTypes.oneOf([
      "nowrap",
      "wrap",
      "wrap-reverse",
      "initial",
      "inherit",
    ]),
    direction: PropTypes.oneOf(["column", "row"]).isRequired,
    justifyContent: PropTypes.oneOf([
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
      "initial",
      "inherit",
    ]),
  }).isRequired,
  isSameAsRow: PropTypes.bool,
};

export default GridAnimated;
