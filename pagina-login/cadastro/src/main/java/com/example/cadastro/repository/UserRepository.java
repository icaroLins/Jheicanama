package com.example.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cadastro.model.Candidate;
//import com.example.cadastro.model.User;

@Repository
public interface UserRepository extends JpaRepository<Candidate,Long> {
    Candidate findByEmail(String email);
    Candidate findByCpf(String cpf);
}
