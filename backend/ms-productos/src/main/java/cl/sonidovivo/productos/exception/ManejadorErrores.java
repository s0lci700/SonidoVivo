package cl.sonidovivo.productos.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

// Todas las respuestas de error tienen la misma forma JSON, igual en los tres microservicios:
// { "error": "mensaje", "campos": { "precio": "motivo" } }   ("campos" solo en errores de @Valid)
// El frontend (services/api.js) muestra "error" y, si viene, el detalle por campo.
@RestControllerAdvice
public class ManejadorErrores {

    // 400: falló alguna anotación de validación (@NotBlank, @Positive, ...) del DTO.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> campos.putIfAbsent(error.getField(), error.getDefaultMessage()));
        Map<String, Object> cuerpo = cuerpo("Hay datos inválidos en el producto");
        cuerpo.put("campos", campos);
        return ResponseEntity.badRequest().body(cuerpo);
    }

    // 400: el cuerpo no es JSON o un campo tiene el tipo equivocado (p. ej. "precio": "abc").
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> jsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(cuerpo("El cuerpo de la petición no es un JSON válido"));
    }

    // 404: el recurso pedido no existe.
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> noEncontrado(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(cuerpo(ex.getMessage()));
    }

    // 404, 409, 400... lanzados desde el servicio con ResponseStatusException.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> negocio(ResponseStatusException ex) {
        HttpStatus estado = HttpStatus.valueOf(ex.getStatusCode().value());
        String mensaje = ex.getReason() != null ? ex.getReason() : estado.getReasonPhrase();
        return ResponseEntity.status(estado).body(cuerpo(mensaje));
    }

    private Map<String, Object> cuerpo(String mensaje) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("error", mensaje);
        return cuerpo;
    }
}
