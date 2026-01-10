package org.sdia.commandeservice.repositories;

import org.sdia.commandeservice.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByUserId(String userId);
}