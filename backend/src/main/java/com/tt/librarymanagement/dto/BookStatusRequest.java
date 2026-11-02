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

public record BookStatusRequest(@NotNull(message = "Status is required (AVAILABLE or ISSUED)") BookStatus status) {
}
