package com.example.cadastro.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig  {
    @Bean
    public PasswordEncoder  passwordEnconder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // desabilita CSRF para testes com Postman/PowerShell
            .authorizeHttpRequests()
                .requestMatchers("/api/register", "/api/login").permitAll() // libera registro e login
                .anyRequest().authenticated() // todos os outros endpoints precisam de autenticação
            .and()
            .httpBasic(); // usa autenticação básica (pode trocar para JWT depois)

        return http.build();
    }
}
