package com.example.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cadastro.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    User findByEmail(String email);
    User findByCpf(String cpf);
}
