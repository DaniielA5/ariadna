# Ariadna

**Librería JavaScript para crear guías interactivas paso a paso, sin frameworks ni dependencias.**

Cuando alguien entra por primera vez a una página o a un formulario, no siempre sabe qué hacer primero. Ariadna resuelve eso: resalta un elemento a la vez, oscurece el resto de la pantalla y muestra una tarjeta con la explicación de ese paso. El usuario avanza con un botón, con el teclado, o simplemente sigue la guía hasta el final.

El mismo componente se puede usar varias veces en una misma página, con distinto contenido, distinto color y distintos textos cada vez, como se ve en la demo de este repositorio.

---

## Demo en vivo

 **[Ver Ariadna funcionando](https://daniiela5.github.io/ariadna/)**

---

## Instalación

No hay que instalar nada con npm ni usar un bundler. Solo se descargan dos archivos (`componente.css` y `componente.js`) y se enlazan en el HTML.

1. Copia las carpetas `css/` y `js/` de este repositorio a tu proyecto (o al menos `css/componente.css` y `js/componente.js`).
2. Enlaza el CSS en el `<head>`:

```html
<link rel="stylesheet" href="css/componente.css">
```

3. Enlaza el JS **antes de cerrar `</body>`**, y antes de tu propio script que va a usarlo:

```html
<script src="js/componente.js"></script>
<script src="js/tu-script.js"></script>
```

Con eso ya está disponible la clase `Ariadna` en el navegador.

---

## Uso

### Ejemplo mínimo

Cada paso necesita un `selector` (el `id` o clase del elemento que se va a resaltar), un `titulo` y un `texto`:

```js
const guia = new Ariadna({
  pasos: [
    { selector: '#nombre', titulo: 'Nombre', texto: 'Escribe tu nombre completo.' },
    { selector: '#correo', titulo: 'Correo', texto: 'Usa un correo que revises seguido.' },
    { selector: '#btnRegistrar', titulo: 'Registrarme', texto: 'Cuando termines, pulsa aquí.', posicion: 'arriba' }
  ]
});

guia.iniciar();
```

Con eso ya aparece el primer resaltado y la tarjeta. El usuario avanza con el botón "Siguiente", con las flechas ← → del teclado, o cierra la guía con Esc o el botón "Saltar".

### Ejemplo con más parámetros

Así se ve en `index.html` de este repositorio, con dos guías distintas usando el mismo componente:

```js
const guiaFormulario = new Ariadna({
  pasos: [
    { selector: '#tituloForm', titulo: 'Registro de usuario', texto: 'Vamos a llenar este formulario campo por campo.' },
    { selector: '#nombre', titulo: 'Nombre', texto: 'Escribe tu nombre completo, solo con letras.' },
    { selector: '#correo', titulo: 'Correo electrónico', texto: 'Usa un correo válido, por ejemplo usuario@gmail.com.' },
    { selector: '#telefono', titulo: 'Teléfono', texto: 'Solo números, 10 dígitos y sin espacios.' },
    { selector: '#password', titulo: 'Contraseña', texto: 'Mínimo 8 caracteres con mayúscula, número y símbolo.' },
    { selector: '#btnRegistrar', titulo: 'Registrarme', texto: 'Cuando termines, pulsa este botón.', posicion: 'arriba' }
  ],
  onPaso: function (estado) {
    console.log('Paso ' + estado.paso + ' de ' + estado.total + ' → ' + estado.titulo);
  },
  onFin: function (completo) {
    console.log(completo ? 'Guía terminada' : 'Guía cerrada antes de terminar');
  }
});

guiaFormulario.iniciar();
```

```js
const guiaPagina = new Ariadna({
  color: '#7a4e2d',            // café en lugar del verde por defecto
  mostrarProgreso: false,      // oculta el "Paso N de M"
  padding: 10,                 // más espacio entre el elemento y el resaltado
  textos: {
    siguiente: 'Continuar',
    anterior: 'Atrás',
    saltar: 'Cerrar',
    finalizar: 'Entendido'
  },
  pasos: [
    { selector: '#encabezado', titulo: 'Encabezado', texto: 'Aquí está el nombre del sitio.' },
    { selector: '#formRegistro', titulo: 'Formulario', texto: 'Aquí se registran los usuarios nuevos.' },
    { selector: '#pie', titulo: 'Pie de página', texto: 'Aquí van los datos del autor.', posicion: 'arriba' }
  ]
});

guiaPagina.iniciar();
```

### Parámetros disponibles

| Parámetro | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `pasos` | array (obligatorio) | — | Cada paso: `{ selector, titulo, texto, posicion }`. `posicion` puede ser `'abajo'` (por defecto) o `'arriba'`. |
| `color` | texto | verde del CSS | Color de acento de bordes y botón principal. |
| `padding` | número | `6` | Espacio en píxeles entre el elemento y el recuadro que lo resalta. |
| `mostrarProgreso` | booleano | `true` | Muestra u oculta el texto "Paso N de M". |
| `textos` | objeto | ver arriba | Cambia las palabras de los botones y del progreso. |
| `onPaso` | función | `null` | Se ejecuta cada vez que se muestra un paso nuevo. |
| `onFin` | función | `null` | Se ejecuta al cerrar la guía. Recibe `true` si llegó al final o `false` si se cerró antes. |

### Métodos

| Método | Qué hace |
|---|---|
| `.iniciar()` | Abre la guía en el primer paso. |
| `.siguiente()` | Avanza un paso. |
| `.anterior()` | Retrocede un paso. |
| `.detener()` | Cierra la guía antes de terminar. |
| `.estado()` | Devuelve `{ activo, paso, total, titulo }` del momento actual. |

---

## Capturas de pantalla



---

## Video de demostración

**[Ver video ]()**

---

## Estructura del repositorio

```
ariadna/
├── index.html          → página de demostración
├── css/
│   ├── componente.css   → estilos del componente (lo único necesario para reutilizarlo)
│   └── index.css        → estilos propios de la página de demo
├── js/
│   ├── componente.js    → la librería (clase Ariadna)
│   └── index.js         → uso del componente en la demo
├── img/                 → capturas de pantalla
└── README.md
```

---

## Autor

Daniel Juárez — Ingeniería en Sistemas Computacionales, Instituto Tecnológico de Oaxaca.
Actividad de Programación Web.
