package com.tt.librarymanagement.dto;

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

public record BookRequest(
        @NotBlank(message = "Book ID is required") @Size(max = 30, message = "Book ID must be at most 30 characters") String bookId,
        @NotBlank(message = "Title is required") @Size(max = 200, message = "Title must be at most 200 characters") String title,
        @NotBlank(message = "Author is required") @Size(max = 120, message = "Author must be at most 120 characters") String author,
        @NotBlank(message = "Category is required") @Size(max = 60, message = "Category must be at most 60 characters") String category) {
}
