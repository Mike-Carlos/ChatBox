# # Use an official Maven image to build the application
# FROM maven:3.9.6-eclipse-temurin-17 AS build

# # Set working directory
# WORKDIR /app

# # Copy the entire project
# COPY . .

# # Verify that pom.xml is copied correctly
# RUN ls -l /app/

# # Build the application
# RUN mvn clean package -DskipTests

# # Use OpenJDK as the runtime environment
# FROM openjdk:17-jdk-slim

# # Set working directory
# WORKDIR /app

# # Copy the built JAR from the first stage
# COPY --from=build /app/target/*.jar app.jar

# # Expose port 8080
# EXPOSE 8080

# # Run the application
# CMD ["java", "-jar", "app.jar"]
