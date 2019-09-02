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
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import createPersistedState from "use-persisted-state";
import "./App.css";
import { HighlightedText } from "./HighlightedText";
import locales from "./locale.json";
import { getCharType, Locale, mapColors } from "./utils";

const localeList = Object.keys(locales) as Locale[];
function getDefaultLocale() {
  const locale: any = (navigator.language || "").slice(0, 2);
  if (localeList.includes(locale)) {
    return locale as Locale;
  }
  return "ru";
}

const targetValue = (f: (val: any) => void) => (ev: any) => {
  return f(ev.target.value);
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
