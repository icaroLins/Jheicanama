package com.example.cadastro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.cadastro.repository")
@EntityScan(basePackages = "com.example.cadastro.model")
public class CadastroApplication {
    public static void main(String[] args) {
        SpringApplication.run(CadastroApplication.class, args);
    }
}