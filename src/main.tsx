import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs.json";
import App from "./App.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeProvider from "./layots/theme/ColorModeProvider.tsx";
import {Provider} from 'react-redux';
import {store} from './redux/store.ts';
import {BrowserRouter} from "react-router-dom";
import {closeSnackbar, SnackbarProvider} from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


Amplify.configure(outputs);
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ColorModeProvider>
                <CssBaseline/>
                <SnackbarProvider maxSnack={3}
                                  action={(snackbarId) => (
                                      <IconButton onClick={() => closeSnackbar(snackbarId)}>
                                          <CloseIcon/>
                                      </IconButton>
                                  )}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </SnackbarProvider>
            </ColorModeProvider>
        </Provider>
    </React.StrictMode>
);
