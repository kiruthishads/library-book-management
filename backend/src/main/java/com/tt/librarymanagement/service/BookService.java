package com.tt.librarymanagement.service;

import com.tt.librarymanagement.entity.*;
import com.tt.librarymanagement.repository.*;
import com.tt.librarymanagement.dto.*;
import com.tt.librarymanagement.exception.*;
import com.tt.librarymanagement.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    public List<Book> list(String search) {
        if (search == null || search.isBlank()) {
            return repository.findAllByOrderByTitleAsc();
        }
        return repository.search(search.trim());
    }

    public LibrarySummary summary() {
        long available = repository.countByStatus(BookStatus.AVAILABLE);
        long issued = repository.countByStatus(BookStatus.ISSUED);
        return new LibrarySummary(available + issued, available, issued);
    }

    @Transactional
    public Book create(BookRequest r) {
        String code = r.bookId().trim().toUpperCase();
        if (repository.existsByBookId(code)) {
            throw new ConflictException("Book ID " + code + " already exists");
        }
        Book b = new Book();
        b.setStatus(BookStatus.AVAILABLE);
        return repository.save(apply(b, r, code));
    }

    @Transactional
    public Book update(Long id, BookRequest r) {
        Book b = find(id);
        String code = r.bookId().trim().toUpperCase();
        repository.findByBookId(code).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new ConflictException("Book ID " + code + " is already used by another book");
            }
        });
        return repository.save(apply(b, r, code));
    }

    /** Issue / return a book. Issuing an already issued book (or returning an available one) is rejected. */
    @Transactional
    public Book changeStatus(Long id, BookStatus status) {
        Book b = find(id);
        if (b.getStatus() == status) {
            throw new ConflictException("Book is already " + status.name().toLowerCase());
        }
        b.setStatus(status);
        return repository.save(b);
    }

    @Transactional
    public void delete(Long id) {
        Book b = find(id);
        if (b.getStatus() == BookStatus.ISSUED) {
            throw new ConflictException("An issued book cannot be removed. Mark it as available first");
        }
        repository.delete(b);
    }

    private Book find(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Book " + id + " not found"));
    }

    private Book apply(Book b, BookRequest r, String code) {
        b.setBookId(code);
        b.setTitle(r.title().trim());
        b.setAuthor(r.author().trim());
        b.setCategory(r.category().trim());
        return b;
    }
}
