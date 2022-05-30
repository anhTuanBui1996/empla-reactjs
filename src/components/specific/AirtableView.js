import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { SpinnerRoundOutlined } from "spinners-react";
import styledComponents from "styled-components";

function AirtableView({ shareId, isForceLoading, stopLoadingHandler }) {
  const [isLoading, setLoading] = useState(true);
  const onLoaded = () => {
    setLoading(false);
    stopLoadingHandler && stopLoadingHandler();
  };
  useEffect(() => {
    isForceLoading && setLoading(true);
  }, [isForceLoading]);
  return (
    <ViewWrapper>
      <iframe
        title={shareId}
        onLoad={onLoaded}
        className="airtable-embed"
        src={`https://airtable.com/embed/${shareId}?backgroundColor=blue&layout=card&viewControls=on`}
        width="100%"
        height="533"
        style={{
          background: "transparent",
          border: "1px solid #ccc",
        }}
        frameBorder={0}
      />
      {(isLoading || isForceLoading) && (
        <ChangFrameLoader>
          <SpinnerRoundOutlined color="#FFF" />
        </ChangFrameLoader>
      )}
    </ViewWrapper>
  );
}

AirtableView.propTypes = {
  /**
   * Source url of iframe
   */
  shareId: PropTypes.string,
  isForceLoading: PropTypes.bool,
  stopLoadingHandler: PropTypes.func,
};

const ViewWrapper = styledComponents.div`
  position: relative;
`;
const ChangFrameLoader = styledComponents.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 533px;
  line-height: 533px;
  text-align: center;
  background-color: #383838b7;
`;

export default AirtableView;
