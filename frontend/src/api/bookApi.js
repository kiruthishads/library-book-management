import api from "./client";

export const fetchBooks = (search) => api.get("/books", { params: search ? { search } : {} }).then((r) => r.data);
export const fetchSummary = () => api.get("/books/summary").then((r) => r.data);
export const createBook = (d) => api.post("/books", d).then((r) => r.data);
export const updateBook = (id, d) => api.put(`/books/${id}`, d).then((r) => r.data);
export const setBookStatus = (id, status) => api.patch(`/books/${id}/status`, { status }).then((r) => r.data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
