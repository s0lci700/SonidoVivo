package cl.sonidovivo.productos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria,String>  {

    public Optional<Categoria> findByNombre(String Nombre);

    boolean existsByNombre(String nombre);
}
