import { Brand } from "./brand";

export const authAppearance = {
  variables: {
    colorPrimary: "#c25a1f",
    colorBackground: "#f1ebdb",
    colorText: "#232b24",
    colorInputBackground: "#fbf8ef",
    borderRadius: "3px",
    fontFamily: "IBM Plex Sans, system-ui, sans-serif",
  },
};

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bar">
        <div className="wrap"><Brand /></div>
      </header>
      <main className="auth-page">{children}</main>
    </>
  );
}
