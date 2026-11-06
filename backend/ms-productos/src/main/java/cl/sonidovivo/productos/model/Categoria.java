package cl.sonidovivo.productos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Getter @Setter 
@Entity 
public class Categoria {
    
    @Id
    @Column(length = 5)
    private String id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Column (nullable = false, unique = true)
    private String nombre;
}
