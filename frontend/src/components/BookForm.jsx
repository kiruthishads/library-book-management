import { useEffect, useState } from "react";

const empty = { bookId: "", title: "", author: "", category: "" };

export default function BookForm({ editing, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    setForm(editing ? { bookId: editing.bookId, title: editing.title, author: editing.author, category: editing.category } : empty);
  }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    ["bookId", "title", "author", "category"].forEach((k) => { if (!form[k].trim()) err[k] = "Required"; });
    setErrors(err);
    if (Object.keys(err).length) return;
    const ok = await onSubmit({ bookId: form.bookId.trim(), title: form.title.trim(), author: form.author.trim(), category: form.category.trim() });
    if (ok && !editing) setForm(empty);
  };

  const field = (name, label, ph) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={change} placeholder={ph} />
      {errors[name] && <span className="field-error">{label} is required</span>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid-form">
        {field("bookId", "Book ID", "e.g. B101")}
        {field("title", "Title")}
        {field("author", "Author")}
        {field("category", "Category", "e.g. Programming")}
      </div>
      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn" disabled={saving}>{editing ? "Update Book" : "Add Book"}</button>
        {editing && <button type="button" className="btn secondary" onClick={onCancel}>Cancel edit</button>}
      </div>
    </form>
  );
}
