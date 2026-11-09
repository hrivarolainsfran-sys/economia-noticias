# Cómo se actualiza Economía en las Noticias

El sitio tiene dos archivos:

- `index.html`: el diseño, la biblioteca de diagramas y la lógica. No hace falta tocarlo para agregar noticias.
- `datos.json`: las noticias, los indicadores, los diarios y el tema de la semana. **Solo se edita este archivo.**

## Reglas editoriales

1. Solo noticias económicas de Paraguay (o internacionales con impacto directo en Paraguay) publicadas por diarios: ABC Color, Última Hora, La Nación, 5Días, InfoNegocios, Diario Hoy, La Tribuna, La Prensa, MarketData, o agencias que ellos replican (EFE, Infobae).
2. Cada cifra tiene que estar en el artículo enlazado. Si no se pudo leer el artículo, no se publica la noticia.
3. `resumen` y `contexto` se escriben con palabras propias. No se copian frases del diario (como máximo una cita de menos de 15 palabras, entre comillas).
4. En temas políticos, se dice solo lo que el artículo afirma y se atribuye («según La Nación…»).
5. Las columnas de opinión llevan `"opinion": true` y sus cifras se atribuyen al autor.
6. No se repiten noticias: si el tema ya está, se actualiza la noticia existente (datos, `fecha`, fuente nueva en `mas`) en lugar de duplicarla.
7. Se mantienen como máximo 40 noticias; se borran primero las más antiguas que no sean del tema de la semana.

## Formato de una noticia

```json
{
 "id": "texto-corto-unico",
 "fecha": "2026-11-09",
 "medio": "ABC Color",
 "url": "https://…",
 "mas": [["Última Hora", "https://…", "2026-11-09"]],
 "opinion": false,
 "titulo": "Título propio, claro y corto",
 "unidad": "micro | macro | global",
 "tema": "3.5",
 "kc": "escasez | eleccion | eficiencia | equidad | bienestar | sostenibilidad | cambio | interdependencia | intervencion",
 "resumen": "2-3 frases: qué pasó, con las cifras principales.",
 "contexto": "4-5 frases: por qué importa y cómo se conecta con la economía.",
 "datos": [["5,50 %", "Qué mide esa cifra"]],
 "clave": ["5,50 %", "texto corto bajo la cifra"],
 "fig": { "k": "macro", "mueve": "D", "dir": 1 },
 "cap": "Qué muestra la lámina, con los rótulos del diagrama.",
 "pasos": ["Cadena causal en 4-5 pasos, de la causa al efecto"],
 "conceptos": [["Término", "Definición corta"]],
 "diagramas": ["politica-monetaria", "da-oa-da"],
 "rel": ["id-de-otra-noticia"],
 "pregunta": { "q": "Pregunta", "opts": ["correcta", "incorrecta", "incorrecta", "incorrecta"], "ok": 0, "fb": "Explicación" }
}
```

- `mas`, `opinion` y `rel` son opcionales.
- `tema`: subtema del programa IB (1.1 a 4.10).
- Números en formato paraguayo: coma decimal y punto de miles (`G. 6.480`, `1,7 %`).

### Láminas (`fig`)

| `k` | Uso | Campos extra |
|---|---|---|
| `mercado` | Oferta y demanda de un producto | `mueve`: `"D"` u `"O"`; `dir`: `1` derecha, `-1` izquierda |
| `macro` | DA y OACP | igual que `mercado` (`"D"` = DA, `"O"` = OACP) |
| `divisas` | Mercado del guaraní | igual (`"D"` demanda de guaraníes, `"O"` oferta) |
| `arancel` | Arancel o su eliminación | — |
| `exportaciones` | Libre comercio con exportaciones | — |
| `minimo` | Salario mínimo / precio mínimo | — |
| `ingreso` | EPD e ingreso total | — |
| `lorenz` | Curva de Lorenz | — |
| `barras` | Datos de la noticia | `u`: unidad; `rows`: `[["Etiqueta", 4.1, 1]]` (el `1` resalta la barra) |

### Diagramas de la biblioteca (`diagramas`)

`oferta-demanda`, `ped-ingreso`, `salario-minimo`, `da-oa-da`, `da-oa-oacp`, `politica-monetaria`, `politica-fiscal`, `tipo-cambio`, `exportaciones`, `arancel`, `lorenz`. Otros nombres se ignoran.

## Indicadores y tema de la semana

- `indicadores`: `[["Nombre", "Valor", "Fuente · fecha", "alert"]]`. El cuarto valor es opcional y pinta el número en rojo cuando hay un movimiento fuerte.
- `destacado`: el tema económico dominante, con `eyebrow`, `titulo`, `dek`, `tl` (línea de tiempo: `[["5 nov", "Qué pasó", "id-noticia"]]`) y `lentes` (`[["clave-de-diagrama", "cómo lo explica"]]`).
- `actualizado`: fecha de la última actualización (`AAAA-MM-DD`).

## Antes de publicar

```bash
python3 -m json.tool datos.json > /dev/null && echo "JSON válido"
```
