package com.Lostify.Lostify.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        // Create default ObjectMapper
        ObjectMapper objectMapper = builder.build();
        
        // Register Hibernate 6 module
        Hibernate6Module hibernateModule = new Hibernate6Module();
        
        // Configure the module to handle lazy loading
        hibernateModule.disable(Hibernate6Module.Feature.USE_TRANSIENT_ANNOTATION);
        
        // Register the module with the ObjectMapper
        objectMapper.registerModule(hibernateModule);
        
        return objectMapper;
    }
}
