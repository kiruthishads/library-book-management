package com.tt.librarymanagement.repository;

import com.tt.librarymanagement.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByBookId(String bookId);

    Optional<Book> findByBookId(String bookId);

    List<Book> findAllByOrderByTitleAsc();

    long countByStatus(BookStatus status);

    @Query("select b from Book b where lower(b.title) like lower(concat('%', :q, '%')) "
            + "or lower(b.author) like lower(concat('%', :q, '%')) order by b.title")
    List<Book> search(@Param("q") String q);
}
