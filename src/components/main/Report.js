import React from "react";
import { Link } from "react-router-dom";

function Report() {
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6 col-xl">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted mb-2">
                      Total hours
                    </h6>
                    <span className="h2 mb-0">763.5</span>
                  </div>
                  <div className="col-auto">
                    <span className="h2 fe fe-briefcase text-muted mb-0"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted mb-2">Exit %</h6>
                    <span className="h2 mb-0">35.5%</span>
                  </div>
                  <div className="col-auto">
                    <div className="chart chart-sparkline">
                      <canvas
                        className="chart-canvas"
                        id="sparklineChart"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-xl-8">
            <div className="card">
              <div className="card-header">
                <h4 className="card-header-title">Conversions</h4>
                <span className="text-muted mr-3">Last year comparision:</span>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="cardToggle"
                    data-toggle="chart"
                    data-target="#conversionsChart"
                    data-trigger="change"
                    data-action="add"
                    data-dataset="1"
                  />
                  <label
                    className="custom-control-label"
                    for="cardToggle"
                  ></label>
                </div>
              </div>
              <div className="card-body">
                <div className="chart">
                  <canvas
                    id="conversionsChart"
                    className="chart-canvas"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="card">
              <div className="card-header">
                <h4 className="card-header-title">Traffic Channels</h4>
                <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
                  <li
                    className="nav-item"
                    data-toggle="chart"
                    data-target="#trafficChart"
                    data-trigger="click"
                    data-action="toggle"
                    data-dataset="0"
                  >
                    <Link
                      to="#"
                      className="nav-link active"
                      data-toggle="tab"
                    >
                      All
                    </Link>
                  </li>
                  <li
                    className="nav-item"
                    data-toggle="chart"
                    data-target="#trafficChart"
                    data-trigger="click"
                    data-action="toggle"
                    data-dataset="1"
                  >
                    <Link to="#" className="nav-link" data-toggle="tab">
                      Direct
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="chart chart-appended">
                  <canvas
                    id="trafficChart"
                    className="chart-canvas"
                    data-toggle="legend"
                    data-target="#trafficChartLegend"
                  ></canvas>
                </div>
                <div id="trafficChartLegend" className="chart-legend"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
