package com.tt.librarymanagement.controller;

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

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    /** List books; optional search by title or author: ?search=java */
    @GetMapping
    public List<Book> list(@RequestParam(required = false) String search) {
        return service.list(search);
    }

    /** Counts of total, available and issued books */
    @GetMapping("/summary")
    public LibrarySummary summary() {
        return service.summary();
    }

    /** Add a book (book ID must be unique; new books are AVAILABLE) */
    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /** Edit book details */
    @PutMapping("/{id}")
    public Book update(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return service.update(id, request);
    }

    /** Change availability: body {"status":"AVAILABLE"} or {"status":"ISSUED"} */
    @PatchMapping("/{id}/status")
    public Book changeStatus(@PathVariable Long id, @Valid @RequestBody BookStatusRequest request) {
        return service.changeStatus(id, request.status());
    }

    /** Remove a book record (not allowed while the book is issued) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
