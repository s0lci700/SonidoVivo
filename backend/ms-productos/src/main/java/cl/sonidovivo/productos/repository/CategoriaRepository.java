package cl.sonidovivo.productos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria,String>  {

    
}
