package org.sdia.produitservice.service;


import org.sdia.produitservice.entity.Produit;
import org.sdia.produitservice.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public Produit ajouterProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit modifierProduit(Long id, Produit produit) {
        Produit p = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        p.setNom(produit.getNom());
        p.setDescription(produit.getDescription());
        p.setPrix(produit.getPrix());
        p.setStock(produit.getStock());
        return produitRepository.save(p);
    }

    public void supprimerProduit(Long id) {
        produitRepository.deleteById(id);
    }

    public List<Produit> listerProduits() {
        return produitRepository.findAll();
    }

    public Produit getProduitById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
    }
}

