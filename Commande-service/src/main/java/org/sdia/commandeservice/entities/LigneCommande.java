package org.sdia.commandeservice.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idProduit;
    private int quantite;
    private double prix;

    public LigneCommande() {}
    public LigneCommande(Long idProduit, int quantite, double prix) {
        this.idProduit = idProduit;
        this.quantite = quantite;
        this.prix = prix;
    }

    public LigneCommande(Object o, Long idProduit, int quantite, double prix) {
    }

    // getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getIdProduit() { return idProduit; }
    public void setIdProduit(Long idProduit) { this.idProduit = idProduit; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
}
