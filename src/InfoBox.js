import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, isRed, isOrange, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isOrange && "infoBox--orange"}
        `}
    >
      <CardContent>
        {/* Title */}
        <Typography className="infoBox___title" color="textSecondary">
          {title}
        </Typography>

        {/* Number of Cases */}
        <h2
          className={`infoBox___cases ${!isRed && "infoBox___cases--green"} ${
            isOrange && "infoBox___cases--orange"
          }`}
        >
          {cases}
        </h2>

        {/* Total */}
        <Typography className="infoBox___total" color="textSecondary">
          {"Total: " + total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
