# Reservas de artículos (Comentarios IA)

Cuando un alumno elige un artículo en la sección «Comentarios IA», el artículo queda
reservado a su nombre y los demás lo ven como «Reservado por otro alumno». Las reservas
se guardan en una hoja de Google del profesor.

## Cómo funciona

- Para reservar, cada alumno escribe su nombre y apellido.
- Cada alumno puede tener un artículo por unidad (2, 3 y 4).
  - Si elige otro artículo de la misma unidad, el anterior se libera.
- Si quita un artículo de su preselección, el artículo vuelve a quedar libre.
- Los alumnos no ven quién reservó cada artículo. Los nombres solo aparecen en la hoja del profesor.
- La página consulta las reservas al abrir la sección y después cada minuto. Antes de guardar una reserva, la hoja comprueba que el artículo siga libre, así que dos alumnos no pueden quedarse con el mismo.

## Puesta en marcha (una sola vez, unos 5 minutos)

1. Cree una hoja de cálculo nueva en Google Sheets (sheets.new). Póngale un nombre, por ejemplo «Reservas IA Economía».
2. En la hoja, vaya a **Extensiones → Apps Script**.
3. Borre lo que aparece en el editor. Pegue todo el contenido de
   [reservas-google.gs](https://raw.githubusercontent.com/hrivarolainsfran-sys/economia-noticias/main/reservas-google.gs)
   y guarde con el ícono del disco.
4. Arriba, elija la función **preparar** y toque **Ejecutar**. Google le va a pedir permiso:
   1. Toque **Revisar permisos** y elija su cuenta.
   2. Verá el aviso «Google no verificó esta app». Es normal, porque el script es suyo. Toque **Configuración avanzada → Ir a … (no seguro)** y después **Permitir**.
   3. En la hoja aparece una pestaña nueva llamada «Reservas».
5. Toque **Implementar → Nueva implementación**.
   1. En el engranaje, elija **Aplicación web**.
   2. En «Ejecutar como», elija **Yo**.
   3. En «Quién tiene acceso», elija **Cualquier persona**.
   4. Toque **Implementar**.
6. Copie la **URL de la aplicación web**, que termina en `/exec`. Esa dirección se guarda en `datos.json` como `ia.reservas`.

La hoja sigue siendo privada. Los alumnos solo hablan con el script, que responde qué artículos están tomados. El script no comparte nombres.

## Hoja de este curso

- Hoja: «Reservas IA Economía» en el Google Drive del profesor (pestaña «Reservas»).
- Script: «Proyecto sin título», implementado como aplicación web el 24 de noviembre de 2026 (versión 1).
- La URL `/exec` está en `datos.json` → `ia.reservas`.

## Tareas del profesor

- **Ver quién eligió qué:** abra la pestaña «Reservas» de la hoja.
- **Liberar un artículo:** clic derecho en el número de la fila → **Eliminar fila**.
- **Empezar con un curso nuevo:** elimine todas las filas menos la primera, la de los títulos.
- **Si cambia el script:** use **Implementar → Administrar implementaciones → Editar (lápiz) → Versión: Nueva versión**. Así la URL no cambia.

## Para apagar las reservas

Deje `ia.reservas` vacío en `datos.json`. La página vuelve a funcionar como antes, con la preselección guardada solo en el navegador de cada alumno.
