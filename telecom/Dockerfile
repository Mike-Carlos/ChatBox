# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the target folder to the container
COPY target/*.jar app.jar

# Expose the port your Spring Boot application runs on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
