package com.example.cadastro.service;

import com.example.cadastro.model.Candidate;
import com.example.cadastro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository; // ou CandidateRepository

    @Override
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {
        Candidate candidate = userRepository.findByCpf(cpf);
        if (candidate == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + cpf);
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(candidate.getCpf())
                .password(candidate.getPassWord()) // senha criptografada
                .roles("USER") // roles
                .build();
    }
}
