# ---- Build stage: compile the Spring Boot jar with Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Download dependencies first so they are cached between builds
COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src src
RUN mvn -q -B package -DskipTests

# ---- Run stage: small JRE image with just the jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/library-book-management-1.0.0.jar app.jar

# Render (and most hosts) pass the port in $PORT; application.properties reads it
ENV PORT=8080
EXPOSE 8080

# Keep memory within small free-tier instances (512 MB)
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Xss512k"

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
