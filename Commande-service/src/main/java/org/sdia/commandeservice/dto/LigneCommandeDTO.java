package org.sdia.commandeservice.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LigneCommandeDTO {

    private Long idProduit;
    private int quantite;
    private double prix;
}
