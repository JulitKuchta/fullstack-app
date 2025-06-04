// src/App.tsx
import { BalanceProvider } from "./components/BalanceBar/BalanceProvider";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <BalanceProvider>
        <AppRouter />
      </BalanceProvider>
    </AuthProvider>
  );
}

export default App;
