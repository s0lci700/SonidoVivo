package cl.sonidovivo.productos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter 
public class Producto {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El codigo es obligatorio")
    @Size(max = 10, message = "El codigo tiene maximo 10 caracteres")
    @Column(nullable = false, unique = true, length = 10)
    private String codigo;

    @NotNull(message = "La categoria es obligatoria")
    @ManyToOne 
    @JoinColumn (name = "categoria_id", nullable = false)
    private Categoria categoria;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @NotNull(message = "El precio es obligatorio")
    @Positive (message = "El precio no puede ser negativo")
    private Integer precio;

    @NotBlank(message = "La descripcion es obligatoria")
    @Column(length = 500)
    @Size(max = 500, message = "La descripcion tiene maximo 500 caracteres.")
    private String descripcion;
}
