package org.sdia.produitservice.controller;

import org.sdia.produitservice.entity.Produit;
import org.sdia.produitservice.service.ProduitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    private static final Logger logger = LoggerFactory.getLogger(ProduitController.class);
    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produit> ajouterProduit(@RequestBody Produit produit, Principal principal) {
        logger.info("Ajout produit par utilisateur: {}", principal.getName());
        Produit saved = produitService.ajouterProduit(produit);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produit> modifierProduit(@PathVariable Long id, @RequestBody Produit produit, Principal principal) {
        logger.info("Modification produit {} par utilisateur: {}", id, principal.getName());
        Produit updated = produitService.modifierProduit(id, produit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimerProduit(@PathVariable Long id, Principal principal) {
        logger.info("Suppression produit {} par utilisateur: {}", id, principal.getName());
        produitService.supprimerProduit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENT')")
    public ResponseEntity<List<Produit>> listerProduits(Principal principal) {
        logger.info("Liste produits consultée par: {}", principal.getName());
        List<Produit> produits = produitService.listerProduits();
        return ResponseEntity.ok(produits);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    public ResponseEntity<Produit> getProduit(@PathVariable Long id) {
        Produit produit = produitService.getProduitById(id);
        return ResponseEntity.ok(produit);
    }
}