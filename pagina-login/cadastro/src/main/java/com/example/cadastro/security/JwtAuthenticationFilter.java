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
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    // Endpoints que não exigem autenticação
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/usuarios/login",
            "/usuarios/register",
            "/contratantes/login",
            "/contratantes/register"
    );

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService){
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Remove query string
        int queryIndex = path.indexOf("?");
        if (queryIndex != -1) {
            path = path.substring(0, queryIndex);
        }

        // Ignora endpoints públicos
        boolean isPublic = PUBLIC_ENDPOINTS.stream().anyMatch(path::equals);
        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT validation
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String cpf = jwtUtil.extractCpf(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(cpf);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
