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
        if (completo) document.getElementById('nombre').focus();
      }
    });

    // ----- Guía 2: mismo componente, otro contenido y otros parámetros -----
    const guiaPagina = new Ariadna({
      color: '#7a4e2d',            // café en lugar de verde
      mostrarProgreso: false,      // sin "Paso N de M"
      padding: 10,
      textos: { siguiente: 'Continuar', anterior: 'Atrás', saltar: 'Cerrar', finalizar: 'Entendido' },
      pasos: [
        { selector: '#encabezado', titulo: 'Encabezado', texto: 'Aquí está el nombre del sitio y el acceso a esta guía.' },
        { selector: '#formRegistro', titulo: 'Formulario', texto: 'Aquí se registran los usuarios nuevos.' },
        { selector: '#pie', titulo: 'Pie de página', texto: 'Aquí van los datos del autor.', posicion: 'arriba' }
      ],
      onPaso: function (estado) {
        console.log('Guía de la página → ' + estado.titulo);
      }
    });

    // Los botones inician cada guía
    document.getElementById('btnGuiaForm').addEventListener('click', function () {
      guiaFormulario.iniciar();
    });
    document.getElementById('btnGuiaPagina').addEventListener('click', function () {
      guiaPagina.iniciar();
    });

    // Envío del formulario (solo demostración: no se envía nada)
    document.getElementById('formRegistro').addEventListener('submit', function (evento) {
      evento.preventDefault();
      const nombre = document.getElementById('nombre').value;
      document.getElementById('mensaje').textContent = '¡Gracias, ' + (nombre || 'usuario') + '! (demo: no se envió nada)';
    });