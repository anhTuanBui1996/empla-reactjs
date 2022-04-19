import React, { useState, useEffect } from "react";
import styledComponents from "styled-components";
import PropTypes from "prop-types";

/**
 * A grid system container that used translate animation when a card
 * is removed.
 * {GridAnimated} component is require at least 1 {GridCard} compopent as
 * a children node, and doesn't have any other component, otherwise the
 * animation can not be applied.
 */
function GridAnimated({ flexProps, children }) {
  const { direction, wrap, justifyContent, alignItems } = flexProps;

  const [gridCardList, setGridCardList] = useState([]);
  const cardPositionSet = new Set();

  const hideCard = (index) => {
    setGridCardList((state) => [
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
    setGridCardList((state) =>
      state.map((card) => ({
        ...card,
        isTranslate: false,
      }))
    );
  };

  const childrenWithProps = React.Children.map(children, (card, index) => (
    <GridCard
      ref={(cardRef) =>
        cardRef &&
        cardPositionSet.add({
          x: cardRef.offsetLeft,
          y: cardRef.offsetTop,
        })
      }
      key={index}
      gridCards={gridCardList}
      className="grid-anim-card"
      cardIndex={index}
      isTranslate={gridCardList[index]?.isTranslate}
    >
      {React.cloneElement(card, {
        onHideCard: () => hideCard(index),
        forceStopTranslate: stopTranslate,
      })}
    </GridCard>
  ));

  useEffect(() => {
    cardPositionSet.forEach((val) => {
      setGridCardList((state) => [
        ...state,
        {
          isHide: false,
          isTranslate: false,
          position: val,
        },
      ]);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <GridContainer
      className="grid-anim-container"
      direction={direction}
      wrap={wrap}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {childrenWithProps}
    </GridContainer>
  );
}

const GridContainer = styledComponents.div`
  position: relative;
  display: flex;
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
    return `
      transition: transform ease-out 0.5s;
      transform: translate(${
        previousCard.position.x - currentCard.position.x
      }px, ${previousCard.position.y - currentCard.position.y - 26}px);`;
    // 26px is 24px (margin-bottom of Card) + 2px (border-top and border-bottom width)
    // this is maybe a bug, because the cardRef offset doesn't have high accuracy
  }}
`;

GridAnimated.propTypes = {
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
};

export default GridAnimated;
