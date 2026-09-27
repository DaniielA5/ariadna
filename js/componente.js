const ARIADNA_PREDETERMINADOS = {
  pasos: [], 
  color: null,
  padding: 6, 
  mostrarProgreso: true,
  textos: {
    anterior: 'Anterior',
    siguiente: 'Siguiente',
    saltar: 'Saltar',
    finalizar: 'Finalizar',
    progreso: 'Paso {n} de {total}'
  },
  onPaso: null,
  onFin: null
};

class Ariadna {

  constructor(opciones = {}) {
    this.opciones = Object.assign({}, ARIADNA_PREDETERMINADOS, opciones);
    this.opciones.textos = Object.assign({}, ARIADNA_PREDETERMINADOS.textos, opciones.textos);

    if (!Array.isArray(this.opciones.pasos) || this.opciones.pasos.length === 0) {
      throw new Error('Ariadna: indica al menos un paso en "pasos".');
    }

    this.indice = 0;        
    this.activo = false; 
    this.elementos = null; 
    // Funcionescuchar eventos
    this._alTeclear = (evento) => {
      if (!this.activo) return;
      if (evento.key === 'Escape') this.detener();
      if (evento.key === 'ArrowRight') this.siguiente();
      if (evento.key === 'ArrowLeft') this.anterior();
    };

    this._alReposicionar= () => {
      if (this.activo) this._posicionar();
    };
  }
  iniciar() {
    if (this.activo) return;  
    this.activo = true;
    this._crearElementos();

    document.addEventListener('keydown', this._alTeclear);
    window.addEventListener('resize', this._alReposicionar);
    window.addEventListener('scroll', this._alReposicionar, true);

    this._mostrarPaso(0, 1);
  }
  siguiente() {
    if (!this.activo) return;
    this._mostrarPaso(this.indice + 1, 1);
  }
  anterior() {
    if (!this.activo) return;
    this._mostrarPaso(this.indice - 1, -1);
  }
  detener() {
    this._terminar(false);
  }
  estado() {
    const paso = this.opciones.pasos[this.indice];
    return {
      activo: this.activo,
      paso: this.activo ? this.indice + 1 : 0,
      total: this.opciones.pasos.length,
      titulo: this.activo ? (paso.titulo || '') : ''
    };
  }

  _crearElementos() {
    const t = this.opciones.textos;

    const contenedor = document.createElement('div');
    contenedor.className = 'ariadna';
    if (this.opciones.color) {
      contenedor.style.setProperty('--ariadna-color', this.opciones.color);
    }

    const capa = document.createElement('div');
    capa.className = 'ariadna-capa';

    const foco = document.createElement('div');
    foco.className = 'ariadna-foco';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'ariadna-tarjeta';
    tarjeta.setAttribute('role', 'dialog');
    tarjeta.innerHTML =
      '<p class="ariadna-progreso"></p>' +
      '<h3 class="ariadna-titulo"></h3>' +
      '<p class="ariadna-texto"></p>' +
      '<div class="ariadna-botones">' +
        '<button type="button" class="ariadna-btn ariadna-saltar"></button>' +
        '<button type="button" class="ariadna-btn ariadna-anterior"></button>' +
        '<button type="button" class="ariadna-btn ariadna-btn--principal ariadna-siguiente"></button>' +
      '</div>';

    contenedor.appendChild(capa);
    contenedor.appendChild(foco);
    contenedor.appendChild(tarjeta);
    document.body.appendChild(contenedor);
 
    this.elementos = {
      contenedor: contenedor,
      foco: foco,
      tarjeta: tarjeta,
      progreso: tarjeta.querySelector('.ariadna-progreso'),
      titulo: tarjeta.querySelector('.ariadna-titulo'),
      texto: tarjeta.querySelector('.ariadna-texto'),
      btnSaltar: tarjeta.querySelector('.ariadna-saltar'),
      btnAnterior: tarjeta.querySelector('.ariadna-anterior'),
      btnSiguiente: tarjeta.querySelector('.ariadna-siguiente')
    };
 
    this.elementos.btnSaltar.textContent = t.saltar;
    this.elementos.btnAnterior.textContent = t.anterior;
 
    this.elementos.btnSaltar.addEventListener('click', () => this.detener());
    this.elementos.btnAnterior.addEventListener('click', () => this.anterior());
    this.elementos.btnSiguiente.addEventListener('click', () => this.siguiente());
  }
 
  _mostrarPaso(indice, direccion) {
    const pasos = this.opciones.pasos;

    while (indice >= 0 && indice < pasos.length && !document.querySelector(pasos[indice].selector)) {
      console.warn('Ariadna: no se encontró "' + pasos[indice].selector + '", se omite el paso.');
      indice = indice + direccion;
    }

    if (indice >= pasos.length) {  
      this._terminar(true);
      return;
    }
    if (indice < 0) return;  

    this.indice = indice;
    const paso = pasos[indice];
    const elemento = document.querySelector(paso.selector);

    const caja = elemento.getBoundingClientRect();
    if (caja.top < 0 || caja.bottom > window.innerHeight) {
      elemento.scrollIntoView({ block: 'center', behavior: 'instant' });
    }

    this._rellenarTarjeta(paso);
    this._posicionar();
    this.elementos.btnSiguiente.focus();

    if (typeof this.opciones.onPaso === 'function') {
      this.opciones.onPaso(this.estado(), paso);
    }
  }
  
  _rellenarTarjeta(paso) {
    const t = this.opciones.textos;
    const total = this.opciones.pasos.length;
    const e = this.elementos;
    const esUltimo = this.indice === total - 1;

    e.titulo.textContent = paso.titulo || '';
    e.texto.textContent = paso.texto || '';

    e.progreso.textContent = t.progreso
      .replace('{n}', this.indice + 1)
      .replace('{total}', total);
    e.progreso.style.display = this.opciones.mostrarProgreso ? 'block' : 'none';

    e.btnAnterior.style.visibility = this.indice === 0 ? 'hidden' : 'visible';
    e.btnSaltar.style.visibility = esUltimo ? 'hidden' : 'visible';
    e.btnSiguiente.textContent = esUltimo ? t.finalizar : t.siguiente;
  }
 
  _posicionar() {
    const paso = this.opciones.pasos[this.indice];
    const elemento = document.querySelector(paso.selector);
    if (!elemento) return;

    const caja = elemento.getBoundingClientRect();    
    const pad = this.opciones.padding;

    //   resaltado   
    const foco = this.elementos.foco;
    foco.style.top = (caja.top - pad) + 'px';
    foco.style.left = (caja.left - pad) + 'px';
    foco.style.width = (caja.width + pad * 2) + 'px';
    foco.style.height = (caja.height + pad * 2) + 'px';

    // --- tarjeta ---
    const tarjeta = this.elementos.tarjeta;
    const alto = tarjeta.offsetHeight;
    const ancho = tarjeta.offsetWidth;
    const separacion = 12;   
    const margen = 12;     
    const altoPantalla = window.innerHeight;
    const anchoPantalla = document.documentElement.clientWidth;

     const cabeAbajo = altoPantalla - (caja.bottom + pad) >= alto + separacion + margen;
    const cabeArriba = (caja.top - pad) >= alto + separacion + margen;
 
    let lado = paso.posicion === 'arriba' ? 'arriba' : 'abajo';
    if (lado === 'abajo' && !cabeAbajo && cabeArriba) lado = 'arriba';
    if (lado === 'arriba' && !cabeArriba && cabeAbajo) lado = 'abajo';

    let top = (lado === 'abajo')
      ? caja.bottom + pad + separacion
      : caja.top - pad - separacion - alto;
    let left = caja.left - pad;
 
    top = Math.max(margen, Math.min(top, altoPantalla - alto - margen));
    left = Math.max(margen, Math.min(left, anchoPantalla - ancho - margen));

    tarjeta.style.top = top + 'px';
    tarjeta.style.left = left + 'px';
  }

  // cierre guia cmplet- true llego final false si cerraron antes.
  _terminar(completo) {
    if (!this.activo) return;
    this.activo = false;

    document.removeEventListener('keydown', this._alTeclear);
    window.removeEventListener('resize', this._alReposicionar);
    window.removeEventListener('scroll', this._alReposicionar, true);

    this.elementos.contenedor.remove();
    this.elementos = null;

    if (typeof this.opciones.onFin === 'function') {
      this.opciones.onFin(completo);
    }
  }
}