package com.example.cadastro.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.cadastro.service.CustomUserDetailsService;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    // Endpoints públicos
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/usuarios/login",
            "/usuarios/register",
            "/usuarios/me",
            "/contratantes/login",
            "/contratantes/register",
            "/contratantes/me",
            "/api/password/forgot",
            "/api/password/reset");

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String originalPath = request.getRequestURI();

        // Remove query string, se houver
        int queryIndex = originalPath.indexOf("?");
        String normalizedPath = (queryIndex != -1) ? originalPath.substring(0, queryIndex) : originalPath;

        boolean isPublic = PUBLIC_ENDPOINTS.stream()
                .anyMatch(p -> normalizedPath.equalsIgnoreCase(p) ||
                        normalizedPath.equalsIgnoreCase(p + "/"));

        // (Opcional) Mostra no console o que está sendo filtrado
        System.out.println("🔎 Requisição recebida em: " + normalizedPath + " | Público: " + isPublic);

        if (!isPublic) {
            // Endpoints privados → autenticação JWT
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (jwtUtil.validateToken(token)) {
                    String identifier = jwtUtil.extractIdentifier(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            // Se não houver token, Spring Security tratará 401 automaticamente
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
