package org.sdia.commandeservice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {

    private Long id;
    private LocalDateTime dateCommande;
    private String statut;
    private Double montantTotal;

    private List<LigneCommandeDTO> lignes; // liste des produits commandés
}

