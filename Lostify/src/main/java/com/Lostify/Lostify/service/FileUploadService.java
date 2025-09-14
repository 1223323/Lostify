package com.Lostify.Lostify.service;

import com.Lostify.Lostify.config.FileUploadConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final FileUploadConfig fileUploadConfig;

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Validate file size
        if (file.getSize() > fileUploadConfig.getMaxFileSize()) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(fileUploadConfig.getUploadDir());
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the URL path
        return "/uploads/" + uniqueFilename;
    }

    public List<String> uploadMultipleFiles(List<MultipartFile> files) throws IOException {
        List<String> uploadedUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String url = uploadFile(file);
                uploadedUrls.add(url);
            }
        }
        
        return uploadedUrls;
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
                String filename = fileUrl.substring("/uploads/".length());
                Path filePath = Paths.get(fileUploadConfig.getUploadDir()).resolve(filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Error deleting file: " + fileUrl + " - " + e.getMessage());
        }
    }
}