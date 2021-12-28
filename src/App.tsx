import React from "react";
import Diagram from "./Diagram";
import hashjs from "hash.js";
import {
  Alert,
  AlertTitle,
  Button,
  createTheme,
  Divider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ThumbUp from "@mui/icons-material/ThumbUp";

import "./App.css";

const letIn =
  "26265713e39cee6c8ba613b25fb844f2ddd9e15842171452a9322ddedab546d990e1b7ebc6497a60483b495c8342e67d6f23b1e49aa544d39af59f0e3a42757d";

const theme = createTheme({
  direction: "rtl",
});

const doHash = (password: string) =>
  hashjs.sha512().update(password).digest("hex");

type LoginProps = {
  success: boolean;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({ success, error, setError, setSuccess }: LoginProps) => {
  const [value, setValue] = React.useState("");
  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (error) setError(false);
    setValue(e.target.value);
  };

  const onVerify = () => {
    if (success) return;
    if (letIn === doHash(value)) setSuccess(true);
    else setError(true);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (["NumpadEnter", "Enter"].includes(e.code)) onVerify();
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center" }}>
      <div style={{ alignSelf: "center", textAlign: "center" }}>
        <Typography variant="h4">شجرة العائلة</Typography>
        <Typography className="bottom-title" variant="h5">
          أبناء سيدي عبد الحفيظ الخنقي
        </Typography>
        <TextField
          id="password"
          label="كلمة المرور"
          variant="standard"
          value={value}
          onChange={onChange}
          onKeyUp={onKeyUp}
          type="password"
          disabled={success}
        />
        <div className="verify-btn">
          <Button
            disabled={success}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={onVerify}
          >
            دخول
          </Button>
        </div>
      </div>
    </div>
  );
};

const localStorageKey = "last-login-at";
const getCurrentTime = () => new Date().getTime().toString();
const getLocalStorageValue = () => window.localStorage.getItem(localStorageKey);
const dayInMs = 60 * 60 * 24 * 1000;
const isLessThanOneDayCache = () =>
  +getCurrentTime() - +(getLocalStorageValue() || "0") < dayInMs;

export default function App() {
  const [display, setDisplay] = React.useState(isLessThanOneDayCache());
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  // Unsecured authentication
  React.useEffect(() => {
    if (display && !getLocalStorageValue()) {
      window.localStorage.setItem(localStorageKey, getCurrentTime());
    }
  }, [display]);

  return (
    <ThemeProvider theme={theme}>
      {error && (
        <Alert severity="error">
          <AlertTitle>كلمة المرور خاطئة</AlertTitle>
          <strong>
            يرجى التحقق من كلمة المرور. الرجاء اعادة المحاولة مرة أخرى
          </strong>
        </Alert>
      )}
      {success && (
        <Alert severity="success">
          <AlertTitle>كلمة المرور سليمة</AlertTitle>
          <Divider className="divider" />
          <div className="alert-content">
            <div>يرجى عدم مشاركة كلمة المرور مع أي فرد من خارج العائلة</div>
            <div>يرجى التواصل مع مشرف الموقع في الحالات الآتية</div>
            <ul>
              <ol>
                عدم امكانية التسجيل مستقبلا. قد يتم تغيير كلمة المرور لحماية
                المعطيات الشخصية خلال كل فترة زمنية
              </ol>
              <ol>في حالة وجود معلومات خاطئة</ol>
              <ol>في حالة رغبتك في حذف اسمك أو أسماء أبناءك</ol>
            </ul>
          </div>
          <Button
            variant="contained"
            endIcon={<ThumbUp />}
            onClick={() => success && setDisplay(true)}
          >
            موافق
          </Button>
        </Alert>
      )}
      <div>
        {display ? (
          <Diagram />
        ) : (
          <Login
            success={success}
            error={error}
            setSuccess={setSuccess}
            setError={setError}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
