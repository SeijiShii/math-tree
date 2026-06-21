import { Routes, Route, Link } from "react-router-dom";
import { TechTreeView } from "./features/tech-tree/TechTreeView";
import { WorkbookView } from "./features/learning-workbook/WorkbookView";
import { AccountView } from "./features/account/AccountView";
import { LegalPage } from "./routes/LegalPage";
import { FeedbackWidget } from "./features/feedback/FeedbackWidget";

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          Math-Tree
        </Link>
        <nav className="app-nav">
          <Link to="/">学びの樹</Link>
          <Link to="/account">マイデータ</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<TechTreeView />} />
          <Route path="/learn/:slug" element={<WorkbookView />} />
          <Route path="/account" element={<AccountView />} />
          <Route path="/legal/privacy" element={<LegalPage doc="privacy" />} />
          <Route path="/legal/terms" element={<LegalPage doc="terms" />} />
          <Route
            path="/legal/specified-commercial-transactions"
            element={<LegalPage doc="sct" />}
          />
        </Routes>
      </main>
      <footer className="app-footer">
        <Link to="/legal/privacy">プライバシー</Link>
        <Link to="/legal/terms">利用規約</Link>
        <Link to="/legal/specified-commercial-transactions">特商法表記</Link>
      </footer>
      <FeedbackWidget />
    </div>
  );
}
