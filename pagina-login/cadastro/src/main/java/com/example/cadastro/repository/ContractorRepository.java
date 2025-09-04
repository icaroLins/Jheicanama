package com.example.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.cadastro.model.Contractor;

@Repository
public interface ContractorRepository extends JpaRepository <Contractor, Long>{
    Contractor findByEmail(String email);
    Contractor findByCnpj(String cnpj);    
}
