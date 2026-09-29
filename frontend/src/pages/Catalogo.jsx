import { useEffect, useState } from "react";
import { ItemList } from "../components/ItemList";
import { obtenerCategorias } from "../services/productoService";
import { useSearchParams } from "react-router-dom";
import { Chip } from "../components/Chip";

export function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        obtenerCategorias().then(setCategorias);
    }, []);
    return (
        <section>
            <h1 className="mb-4 font-display text-4xl">Catálogo</h1>
            <Filtros  categorias={categorias} setSearchParams={setSearchParams} seleccionada={searchParams.get("categoria")}/>
            <ItemList categoriaId={searchParams.get("categoria")}/>
        </section>
    )
}
function Filtros(props) {
    return (
        <div role="group" aria-label="Filtrar por categoría" 
        className="scrollbar-none flex gap-2 overflow-x-auto pb-2 mb-6">
            <Chip 
            seleccionado={!props.seleccionada} 
            onClick={() => props.setSearchParams({})}>Todas
            </Chip>
            {props.categorias.map((categoria) => (
            <Chip 
            key={categoria.id} 
            seleccionado={categoria.id === props.seleccionada} 
            onClick={() => props.setSearchParams({ categoria: categoria.id })}>
                {categoria.nombre}
            </Chip>
            ))}
        </div>
    );
}