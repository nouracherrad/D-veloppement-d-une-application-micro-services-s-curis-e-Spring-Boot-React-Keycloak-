package org.sdia.produitservice;

import org.sdia.produitservice.entity.Produit;
import org.sdia.produitservice.repository.ProduitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProduitServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProduitServiceApplication.class, args);
	}

	// Crée quelques produits au démarrage
	@Bean
	CommandLineRunner initDatabase(ProduitRepository produitRepository) {
		return args -> {
			Produit p1 = new Produit(null, "PC Portable", "Dell Inspiron 15", 7500.0, 10);
			Produit p2 = new Produit(null, "Smartphone", "Samsung Galaxy S23", 4500.0, 20);
			Produit p3 = new Produit(null, "Clavier", "Clavier mécanique Logitech", 500.0, 50);
			Produit p4 = new Produit(null, "Souris", "Souris sans fil Logitech", 300.0, 60);

			produitRepository.save(p1);
			produitRepository.save(p2);
			produitRepository.save(p3);
			produitRepository.save(p4);

			System.out.println("Produits initiaux créés !");
		};
	}
}
