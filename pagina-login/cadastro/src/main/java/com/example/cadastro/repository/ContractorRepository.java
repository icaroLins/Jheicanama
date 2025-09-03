package com.example.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cadastro.model.Contractor;

public interface ContractorRepository extends JpaRepository <Contractor, Long>{
    Contractor findByEmail(String email);
    Contractor findByCnpj(String cnpj);    
}
