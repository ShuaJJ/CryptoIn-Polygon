import { BulbFilled, BulbOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === "light"));
  const { switcher, currentTheme, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    const isChecked = !isDarkMode;
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  return (
    <div className="main fade-in" onClick={toggleTheme} style={{padding: "0 8px", fontSize: "20px", cursor: "pointer"}}>
      {isDarkMode ? <BulbOutlined /> : <BulbFilled />}
    </div>
  );
}
