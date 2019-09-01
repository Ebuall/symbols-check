import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import createPersistedState from "use-persisted-state";
import "./App.css";
import locales from "./locale.json";

type Locale = keyof typeof locales;
const localeList = Object.keys(locales) as Locale[];

function getDefaultLocale() {
  const locale: any = (navigator.language || "").slice(0, 2);
  if (localeList.includes(locale)) {
    return locale as Locale;
  }
  return "ru";
}

function ascOrEq(...numbers: number[]) {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (!(numbers[i] <= numbers[i + 1])) return false;
  }
  return true;
}
function getCharType(code: number) {
  if (ascOrEq(49, code, 57)) {
    return "numeric";
  }
  if (ascOrEq(65, code, 90)) {
    return "latin";
  }
  if (ascOrEq(97, code, 122)) {
    return "latin";
  }
  if (ascOrEq(1040, code, 1103)) {
    return "cyrillic";
  }
  return "other";
}

const targetValue = (f: (val: any) => void) => (ev: any) => {
  return f(ev.target.value);
};

function mapColors(
  type: ReturnType<typeof getCharType>,
): TypographyProps["color"] {
  switch (type) {
    case "latin":
      return "textPrimary";
    case "cyrillic":
      return "textSecondary";
    case "numeric":
      return "primary";
    default:
      return "error";
  }
}

const HighlightedText: React.FC<{ value: string; locale: Locale }> = ({
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

const theme = createMuiTheme({ typography: { fontSize: 18 } });
const useLocalStorage = createPersistedState("locale");
const App: React.FC = () => {
  const [locale, setLocale_] = useLocalStorage(getDefaultLocale());
  const [text, setText_] = React.useState("");
  const setLocale = React.useMemo(() => targetValue(setLocale_), [setLocale_]);
  const setText = React.useMemo(() => targetValue(setText_), [setText_]);

  const localeDict = locales[locale];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container className="App">
        <Grid item md={2} />
        <Grid item md={8} xs={12} className="middle-column">
          <Container maxWidth="sm">
            <Card className="main-card">
              <CardHeader
                title={localeDict.title}
                subheader={localeDict.description}
              />
              <CardContent>
                <TextField
                  label={localeDict.enterSymbols}
                  variant="outlined"
                  multiline
                  fullWidth
                  onChange={setText}
                  value={text}
                  className="text-field"
                />
                {!!text.length && (
                  <>
                    <HighlightedText value={text} locale={locale} />
                    <hr></hr>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{localeDict["#"]}</TableCell>
                          <TableCell>{localeDict.char}</TableCell>
                          <TableCell>{localeDict.type}</TableCell>
                          <Tooltip title="UTF-16 decimal">
                            <TableCell>{localeDict.code}*</TableCell>
                          </Tooltip>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {text.split("").map((ch, i) => {
                          const code = ch.charCodeAt(0);
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{ch}</TableCell>
                              <TableCell>
                                <Typography
                                  color={mapColors(getCharType(code))}
                                  component="span"
                                >
                                  {localeDict[getCharType(code)]}
                                </Typography>
                              </TableCell>
                              <TableCell>{code}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </Container>
        </Grid>
        <Grid item>
          <RadioGroup
            name="locale"
            value={locale}
            onChange={setLocale}
            className="language-select"
          >
            {localeList.map(entry => (
              <FormControlLabel
                key={entry}
                label={locales[entry].localeTitle}
                value={entry}
                control={<Radio color="primary" />}
              />
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
