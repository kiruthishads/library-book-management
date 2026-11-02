import BooksPage from "./pages/BooksPage.jsx";

export default function App() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <h1>📚 Library Book Management</h1>
          <p>Keep the catalogue up to date and see which books can be borrowed.</p>
        </div>
      </header>
      <main className="container">
        <BooksPage />
      </main>
    </>
  );
}
