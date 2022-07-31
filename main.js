/*
 * César Armando Cruz Mendoza
 *
 * Enunciado:
 * Crear una gráfica de barras que represente cuántos mundiales
 * tiene cada equipo.
 * Bonus: Conectar el slider para que la gráfica se modifique 
 * para ver quién tiene más mundiales hasta ese año
*/

/* Define la configuración del espacio de las gráficas */
const width = 800
const height = 500
const margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 80
}

/* variables globales */
let fechasMundiales = []        //contiene la lista de años de los mundiales
let copiaDatos = []             // copia de los datos


/* Agrega el svg al div con id 'my-chart' */
const svg = d3.select('#my-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

/* Configura el espacio de trabajo para la gráfica */
const elementGroup = 
        svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
const axisGroup = 
        svg.append('g')
const xAxisGroup = 
        axisGroup.append("g")
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = 
        axisGroup.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

const y = d3.scaleBand()
        .range([height - margin.top - margin.bottom, 0]).padding(0.1)
const x = d3.scaleLinear()
        .range([0, width - margin.left - margin.right])
        
let xAxis = d3.axisBottom()
        .scale(x)
let yAxis = d3.axisLeft()
        .scale(y)


/* Función para obtener el vector de fechas de mundiales */
function vectorFechasMundiales(data) {
    //obtiene la lista de años de los mundiales
    fechasMundiales = data.map(d => d.year)
 }

/* Función para transformar los datos */
function transformaDatos(data, fecha) {
    let datos = []
    let vector = []

    /* remueve las fechas que no hubo mundial */
    /* obtiene el valor entero de la fecha */
    /* filtra para los mundiales <= fecha */
    data.forEach(function (d){
        if (d.winner.length > 0) {
            if (d.year <= fecha) {
                d.year = +d.year
                datos.push(d)
            }
        }
    })

    /* obtiene el vector de fechas de mundiales */
    vectorFechasMundiales(datos) 

    /* agrupa los datos por pais*/
    datos = d3.nest()  
        .key(d => d.winner)
        .entries(datos)
     
    /* obtiene un arreglo con pais y total de mundiales a la fecha ganados */
    datos.forEach( function (d) {
        vector.push (
            {
                winner: d.key,
                mundiales: d.values.length
            }
        )    
    })
    return vector
}

/* Carga los datos del archivo csv */
d3.csv('data.csv').then(data => {
    /* Inicia la preparación de los datos */
    copiaDatos = data;

    /* define la fecha inicial para la carga de los datos */
    let fecha = 2018

    /* inicia el procesamiento de los datos */
    procesaDatos(fecha);
    slider();
});


/* Función para el procesamiento de la información y despliegue de las gráficas */
function procesaDatos(fecha) {
    let datos = transformaDatos(copiaDatos, fecha)

    x.domain([0, d3.max(datos, d => d.mundiales)])
    y.domain(datos.map(d => d.winner))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    elementGroup.selectAll('rect').data(datos)
        .join('rect')
        .attr('x', d => x(0))
        .attr('y', d => y(d.winner))
        .attr('width', d => x(d.mundiales))
        .attr('height', y.bandwidth())
};


// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(fechasMundiales))  // rango años
        .max(d3.max(fechasMundiales))
        .step(4)  // cada cuánto aumenta el slider
        .width(580)  // ancho de nuestro slider
        .ticks(fechasMundiales.length)  
        .default(fechasMundiales[fechasMundiales.length -1])  // punto inicio de la marca
        .on('onchange', val => {
            console.log("La función aún no está conectada con la gráfica")
            procesaDatos(val);
            // conectar con la gráfica aquí
        });

        var gTime = d3
        .select('div#slider-time')  // div donde lo insertamos
        .append('svg')
        .attr('width', width * 0.8)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());
}


