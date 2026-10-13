import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Contacto } from "./Contacto";

describe("Contacto", () => {
  it("muestra el formulario", () => {
    render(<Contacto />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  it("muestra errores al enviar", () => {
    render(<Contacto />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });

  it("valida, confirma y limpia", () => {
    render(<Contacto />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "Ma@sonido.cl" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Lorem Ipsum Dolor Sit Amet" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });
});
