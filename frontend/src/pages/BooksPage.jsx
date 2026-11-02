import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../api/client";
import { createBook, deleteBook, fetchBooks, fetchSummary, setBookStatus, updateBook } from "../api/bookApi";
import BookForm from "../components/BookForm.jsx";
import Notice from "../components/Notice.jsx";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, available: 0, issued: 0 });
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([fetchBooks(applied), fetchSummary()]);
      setBooks(list);
      setSummary(sum);
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await updateBook(editing.id, data);
        setNotice({ type: "success", text: "Book updated" });
        setEditing(null);
      } else {
        await createBook(data);
        setNotice({ type: "success", text: "Book added to the library" });
      }
      await load();
      return true;
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (b) => {
    const next = b.status === "AVAILABLE" ? "ISSUED" : "AVAILABLE";
    try {
      await setBookStatus(b.id, next);
      setNotice({ type: "success", text: `"${b.title}" is now ${next === "ISSUED" ? "issued" : "available"}` });
      await load();
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
      await load();
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Remove "${b.title}" from the library?`)) return;
    try {
      await deleteBook(b.id);
      setNotice({ type: "success", text: "Book removed" });
      if (editing?.id === b.id) setEditing(null);
      await load();
    } catch (err) {
      setNotice({ type: "error", text: errorMessage(err) });
    }
  };

  return (
    <>
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <div className="grid" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="label">Total books</div><div className="value">{summary.total}</div></div>
        <div className="stat"><div className="label">Available</div><div className="value" style={{ color: "var(--ok)" }}>{summary.available}</div></div>
        <div className="stat"><div className="label">Issued</div><div className="value" style={{ color: "var(--bad)" }}>{summary.issued}</div></div>
      </div>

      <section className="card">
        <h2>{editing ? "Edit book" : "Add book"}</h2>
        <BookForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} saving={saving} />
      </section>

      <section className="card">
        <form className="toolbar" onSubmit={(e) => { e.preventDefault(); setApplied(query.trim()); }}>
          <h2 style={{ margin: 0 }}>Books</h2>
          <span className="spacer" />
          <input placeholder="Search by title or author" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn">Search</button>
          {applied && <button type="button" className="btn secondary" onClick={() => { setQuery(""); setApplied(""); }}>Show all</button>}
        </form>
        {loading ? <div className="loading">Loading books…</div> : books.length === 0 ? (
          <div className="empty">{applied ? `No books match "${applied}".` : "The library is empty. Add the first book above."}</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Book ID</th><th>Title</th><th>Author</th><th>Category</th><th>Availability</th><th>Actions</th></tr></thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.bookId}</strong></td><td>{b.title}</td><td>{b.author}</td><td>{b.category}</td>
                    <td><span className={`badge ${b.status === "AVAILABLE" ? "green" : "red"}`}>{b.status === "AVAILABLE" ? "Available" : "Issued"}</span></td>
                    <td className="btn-row">
                      <button className="btn small" onClick={() => changeStatus(b)}>{b.status === "AVAILABLE" ? "Issue" : "Mark returned"}</button>
                      <button className="btn small secondary" onClick={() => { setEditing(b); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                      <button className="btn small danger" onClick={() => remove(b)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
