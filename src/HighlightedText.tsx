import { Tooltip, Typography } from "@material-ui/core";
import React from "react";
import locales from "./locale.json";
import { getCharType, Locale, mapColors } from "./utils";

export const HighlightedText: React.FC<{ value: string; locale: Locale }> = ({
  value,
  locale,
}) => {
  if (value.length < 1) return null;

  const groupedByType = [value[0]];
  for (let i = 1; i < value.length; i++) {
    const last = groupedByType.length - 1;
    if (
      getCharType(value[i].charCodeAt(0)) ===
      getCharType(groupedByType[last].charCodeAt(0))
    ) {
      groupedByType[last] = groupedByType[last] + value[i];
    } else {
      groupedByType.push(value[i]);
    }
  }
  return (
    <Typography className="highlighted-text">
      {groupedByType.map((chars, i) => {
        const type = getCharType(chars.charCodeAt(0));
        return (
          <Tooltip title={locales[locale][type]} key={i}>
            <Typography
              color={mapColors(type)}
              component="span"
              className="highlighted-text__entry"
            >
              {chars}
            </Typography>
          </Tooltip>
        );
      })}
    </Typography>
  );
};
