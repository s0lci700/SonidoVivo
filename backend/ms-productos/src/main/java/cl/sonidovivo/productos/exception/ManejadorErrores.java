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

// Todas las respuestas de error tienen la misma forma JSON:
// { "estado": 400, "mensaje": "...", "errores": { "campo": "motivo" } }
// El frontend muestra "mensaje" y, si viene, el detalle por campo.
@RestControllerAdvice
public class ManejadorErrores {

    // 400: falló alguna anotación de validación (@NotBlank, @Positive, ...) de la
    // entidad.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(error.getField(), error.getDefaultMessage()));
        Map<String, Object> cuerpo = cuerpo(HttpStatus.BAD_REQUEST, "Hay datos inválidos en el producto");
        cuerpo.put("errores", errores);
        return ResponseEntity.badRequest().body(cuerpo);
    }

    // 400: el cuerpo no es JSON o un campo tiene el tipo equivocado (p. ej.
    // "precio": "abc").
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> jsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest()
                .body(cuerpo(HttpStatus.BAD_REQUEST, "El cuerpo de la petición no es un JSON válido"));
    }

    // 404: el recurso pedido no existe.
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> noEncontrado(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(cuerpo(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    // 404, 409, 400... lanzados desde el servicio con ResponseStatusException.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> negocio(ResponseStatusException ex) {
        HttpStatus estado = HttpStatus.valueOf(ex.getStatusCode().value());
        return ResponseEntity.status(estado).body(cuerpo(estado, ex.getReason()));
    }

    private Map<String, Object> cuerpo(HttpStatus estado, String mensaje) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("estado", estado.value());
        cuerpo.put("mensaje", mensaje);
        return cuerpo;
    }
}
